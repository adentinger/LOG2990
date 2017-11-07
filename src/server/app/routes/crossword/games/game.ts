import { CrosswordTimerPacket } from '../../../../../common/src/crossword/packets/crossword-timer.packet';
import '../../../../../common/src/crossword/packets/crossword-timer.parser';
import '../../../../../common/src/crossword/packets/grid-word.parser';
import '../../../../../common/src/crossword/packets/game-definition.parser';
import '../../../../../common/src/crossword/packets/clear-grid.parser';
import '../../../../../common/src/crossword/packets/game-start.parser';

import { CrosswordGameConfigs, PlayerNumber, GameId } from '../../../../../common/src/communication/game-configs';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { PacketManagerServer } from '../../../packet-manager';
import { PacketEvent, PacketHandler, registerHandlers } from '../../../../../common/src/index';
import { Logger } from '../../../../../common/src/logger';
import { Difficulty, GameMode } from '../../../../../common/src/crossword/crossword-enums';
import { GameData, DefinitionWithIndex } from './game-data';
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
    private wordsInternal: GridWord[] = [];
    private definitionsInternal: DefinitionWithIndex[] = [];
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
            this.initializeData(configs.difficulty).catch((reason) => console.log(reason));

        this.packetManager.registerDisconnectHandler((socketId: string) => {
            const INDEX = this.players.findIndex((player) => player.socketId === socketId);
            const FOUND = INDEX >= 0;
            if (FOUND) {
                this.players.splice(INDEX, 1);
            }
        });

        registerHandlers(this, this.packetManager);
    }

    public get words(): GridWord[] {
        return this.wordsInternal.slice();
    }

    public get definitions(): DefinitionWithIndex[] {
        return this.definitionsInternal.slice();
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
                this.communicationHandler.sendGridWords(player.socketId, this.words);
                this.communicationHandler.sendDefinitions(player.socketId, this.definitions);
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
        // return this.playerIds.findIndex((id) => id === playerId) >= 0;
        return this.players.findIndex((player) => player.socketId === playerId) >= 0;
    }

    public validateUserAnswer(wordTry: GridWord): boolean {
        const ID = wordTry.id;
        const DIRECTION = wordTry.direction;
        const STRING = wordTry.string;

        const FOUND = this.words.findIndex(
            (word) => {
                return word.id === ID &&
                    word.direction === DIRECTION &&
                    word.string === STRING;
            }) >= 0;
        if (FOUND) {
            this.countdown = COUNTDOWN_DEFAULT_VALUE;
        }
        return FOUND;
    }

    public isSocketIdInGame(socketId: string): boolean {
        return this.players.findIndex((id) => id.socketId === socketId) >= 0;
    }

    private async initializeData(difficulty: Difficulty): Promise<void> {
        this.wordsInternal =
            await GameData.getInstance().initializeGrid(difficulty);
        this.definitionsInternal =
            await GameData.getInstance().getDefinitionsOf(this.words, difficulty);
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
