import { CrosswordTimerPacket } from '../../../../../common/src/crossword/packets/crossword-timer.packet';
import '../../../../../common/src/crossword/packets/crossword-timer.parser';
import { WordTryPacket } from '../../../../../common/src/crossword/packets/word-try.packet';
import '../../../../../common/src/crossword/packets/word-try.parser';
import '../../../../../common/src/crossword/packets/grid-word.parser';
import '../../../../../common/src/crossword/packets/game-definition.parser';
import '../../../../../common/src/crossword/packets/clear-grid.parser';
import '../../../../../common/src/crossword/packets/game-start.parser';

import { CrosswordGameConfigs, PlayerNumber, GameId } from '../../../../../common/src/communication/game-configs';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { PacketManagerServer } from '../../../packet-manager';
import { PacketEvent, PacketHandler, registerHandlers } from '../../../../../common/src/index';
import { Logger } from '../../../../../common/src/logger';
import { GameMode, Owner } from '../../../../../common/src/crossword/crossword-enums';
import { GameData } from './game-data';
import { CommunicationHandler } from './communication-handler';
import { Player } from './player';

const logger = Logger.getLogger('CrosswordGame');

const COUNTDOWN_DEFAULT_VALUE = 3600; // 1 minute

export class Game {

    private static readonly COUNTDOWN_INITAL = COUNTDOWN_DEFAULT_VALUE;
    private static idCounter = 0;

    public readonly id: GameId;
    public countdown = Game.COUNTDOWN_INITAL;

    private readonly initialized: Promise<void>;
    private started = false;
    private packetManager: PacketManagerServer = PacketManagerServer.getInstance();
    private readonly dataInternal: GameData = new GameData();
    private readonly players: Player[] = [];
    private readonly maxPlayers: PlayerNumber;
    private readonly configurationInternal: CrosswordGameConfigs;
    private communicationHandler: CommunicationHandler;

    constructor(configs: CrosswordGameConfigs) {
        this.communicationHandler = new CommunicationHandler();
        this.configurationInternal = configs;

        this.id = Game.idCounter++;
        this.maxPlayers = configs.playerNumber;

        this.initialized =
            this.data.initialize(configs.difficulty).catch((reason) => console.log(reason));

        this.packetManager.registerDisconnectHandler((socketId: string) => {
            const INDEX = this.players.findIndex((player) => player.socketId === socketId);
            const FOUND = INDEX >= 0;
            if (FOUND) {
                this.players.splice(INDEX, 1);
            }
        });

        registerHandlers(this, this.packetManager);
    }

    public get data(): GameData {
        return this.dataInternal;
    }

    public get configuration(): CrosswordGameConfigs {
        const config: CrosswordGameConfigs = {
            difficulty: this.configurationInternal.difficulty,
            gameId: this.id,
            gameMode: this.configurationInternal.gameMode,
            playerNumber: this.maxPlayers,
            playerName: this.players.length > 0 ? this.players[0].name : ''
        };
        return config;
    }

    public get currentNumberOfPlayers(): number {
        return this.players.length;
    }

    public addPlayer(player: Player): PlayerNumber {
        if (this.players.length < this.maxPlayers) {
            this.players.push(player);
            this.initialized.then(() => {
                this.communicationHandler.clearPlayerGrid(player.socketId);
                this.communicationHandler.sendGridWords(player.socketId, this.dataInternal.emptyWords);
                this.communicationHandler.sendDefinitions(player.socketId, this.dataInternal.definitions);
            }).catch((reason) => console.log(reason));
            if (this.players.length === this.maxPlayers) {
                this.start();
            }
            return this.players.length;
        }
        else {
            throw new Error('Cannot add a new player: max number reached.');
        }
    }

    public isPlayerInGame(playerId: string): boolean {
        return this.players.findIndex((player) => player.socketId === playerId) >= 0;
    }

    public validateUserAnswer(wordTry: GridWord, socketId: string): void {
        const DIRECTION = wordTry.direction;
        const STRING = wordTry.string;

        const FOUND = this.dataInternal.words.findIndex(
            (word) => {
                return word.direction === DIRECTION &&
                       word.string === STRING;
            }) >= 0;
        if (FOUND) {
            this.sendWordFound(wordTry, socketId);
        }
    }

    private sendWordFound(foundWord: GridWord, finderId: string): void {
        foundWord.owner = Owner.player1;
        const finderPacket = new WordTryPacket(foundWord);
        this.packetManager.sendPacket(
            WordTryPacket,
            finderPacket,
            finderId
        );
        if (this.maxPlayers > 1) {
            const opponentPacket = new WordTryPacket(new GridWord(
                foundWord.id,
                foundWord.y,
                foundWord.x,
                foundWord.length,
                foundWord.direction,
                Owner.player2,
                foundWord.string
            ));
            const opponent =
                this.players.find((player) => player.socketId !== finderId);
            this.packetManager.sendPacket(
                WordTryPacket,
                opponentPacket,
                opponent.socketId
            );
        }
    }

    public isSocketIdInGame(socketId: string): boolean {
        return this.players.findIndex((id) => id.socketId === socketId) >= 0;
    }

    private start(): void {
        if (!this.started) {
            this.started = true;
            this.players.forEach((player) => {
                this.communicationHandler.sendGameStart(this.players);
            });
            if (this.configurationInternal.gameMode === GameMode.Dynamic) {
                this.startTimer();
            }
        }
        else {
            throw new Error('Cannot start game: Game already started.');
        }
    }

    private startTimer() {
        const ONE_SECOND = 1000;
        setInterval(() => {
            this.countdown--;
            this.players.forEach((player) => {
                if (player !== null) {
                    logger.log('(game #%s) Timer: %d', this.id, this.countdown);
                    this.packetManager.sendPacket(
                        CrosswordTimerPacket,
                        new CrosswordTimerPacket(this.countdown), player.socketId
                    );
                }
            });
        }, ONE_SECOND);
    };

    @PacketHandler(CrosswordTimerPacket)
    // tslint:disable-next-line:no-unused-variable
    private getCheatModeTimerValue(event: PacketEvent<CrosswordTimerPacket>) {
        this.countdown = event.value.countdown;
    }
}
