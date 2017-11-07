import { CrosswordTimerPacket } from '../../../../../common/src/crossword/packets/crossword-timer.packet';
import '../../../../../common/src/crossword/packets/crossword-timer.parser';
import { GridWordPacket } from '../../../../../common/src/crossword/packets/grid-word.packet';
import '../../../../../common/src/crossword/packets/grid-word.parser';
import { GameDefinitionPacket } from '../../../../../common/src/crossword/packets/game-definition.packet';
import '../../../../../common/src/crossword/packets/game-definition.parser';
import { ClearGridPacket } from '../../../../../common/src/crossword/packets/clear-grid.packet';
import '../../../../../common/src/crossword/packets/clear-grid.parser';
import { GameStartPacket } from '../../../../../common/src/crossword/packets/game-start.packet';
import '../../../../../common/src/crossword/packets/game-start.parser';

import { CrosswordGameConfigs, PlayerNumber, GameId } from '../../../../../common/src/communication/game-configs';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { PacketManagerServer } from '../../../packet-manager';
import { PacketEvent, PacketHandler, registerHandlers } from '../../../../../common/src/index';
import { Logger } from '../../../../../common/src/logger';
import { GameMode, Difficulty } from '../../../../../common/src/crossword/crossword-enums';
import { GameInitializer, DefinitionWithIndex } from './game-initializer';
import { Player } from './player';

const logger = Logger.getLogger('CrosswordGame');

const COUNTDOWN_DEFAULT_VALUE = 3600; // 1 minute

export class Game {

    private static readonly COUNTDOWN_INITAL = COUNTDOWN_DEFAULT_VALUE;
    private static idCounter = 0;

    public readonly id: GameId;
    public readonly numberOfPlayers: PlayerNumber;
    public countdown = Game.COUNTDOWN_INITAL;

    private readonly initialized: Promise<void>;
    private started = false;
    private packetManager: PacketManagerServer = PacketManagerServer.getInstance();
    private wordsInternal: GridWord[] = [];
    private definitionsInternal: DefinitionWithIndex[] = [];
    private readonly players: Player[] = [];
    private readonly configurationInternal: CrosswordGameConfigs;

    constructor(configs: CrosswordGameConfigs) {
        this.configurationInternal = configs;

        this.id = Game.idCounter++;
        this.numberOfPlayers = configs.playerNumber;

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

        if (configs.gameMode === GameMode.Dynamic) {
            this.startTimer();
        }
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
            playerNumber: this.numberOfPlayers,
            playerName: this.players.length > 0 ? this.players[0].name : ''
        };
        return config;
    }

    public addPlayer(player: Player): PlayerNumber {
        if (this.players.length < this.numberOfPlayers) {
            this.players.push(player);
            this.initialized.then(() => {
                this.clearPlayerGrid(player.socketId);
                this.sendGridWords(player.socketId);
                this.sendDefinitions(player.socketId);
            }).catch((reason) => console.log(reason));
            if (this.players.length === this.numberOfPlayers) {
                this.start();
            }
            return this.players.length;
        }
        else {
            throw new Error('Cannot add a new player: max number reached.');
        }
    }

    private async clearPlayerGrid(playerId: string): Promise<void> {
        this.packetManager.sendPacket(ClearGridPacket, new ClearGridPacket(), playerId);
    }

    private sendGridWords(socketId: string): void {
        this.words.forEach((word) => {
                this.packetManager.sendPacket(
                    GridWordPacket,
                    new GridWordPacket(word),
                    socketId
                );
            }
        );
    }

    private sendDefinitions(socketId: string): void {
        const definitionsWithIndex = this.definitions;
        definitionsWithIndex.forEach((definitionWithIndex) => {
            const index = definitionWithIndex.index;
            const definition = definitionWithIndex.definition;
            this.packetManager.sendPacket(
                GameDefinitionPacket,
                new GameDefinitionPacket(index, definition.direction, definition),
                socketId
            );
        });
    }

    public isSocketIdInGame(socketId: string): boolean {
        return this.players.findIndex((id) => id.socketId === socketId) >= 0;
    }

    private async initializeData(difficulty: Difficulty): Promise<void> {
        this.wordsInternal =
            await GameInitializer.getInstance().initializeGrid(difficulty);
        this.definitionsInternal =
        await GameInitializer.getInstance().getDefinitionsOf(this.words, difficulty);
    }

    private start(): void {
        if (!this.started) {
            this.started = true;
            this.players.forEach((player) => {
                this.packetManager.sendPacket(GameStartPacket, new GameStartPacket(), player.socketId);
            });
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

}
