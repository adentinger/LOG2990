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
import { GameMode, Difficulty } from '../../../../../common/src/crossword/crossword-enums';
import { GameInitializer, DefinitionWithIndex } from './game-initializer';
import { CommunicationHandler } from './communication-handler';

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
    private readonly playerIds: string[] = [];
    private readonly configurationInternal: CrosswordGameConfigs;
    private communicationHandler: CommunicationHandler;

    constructor(configs: CrosswordGameConfigs) {
        this.communicationHandler = new CommunicationHandler();
        this.configurationInternal = configs;

        this.id = Game.idCounter++;
        this.numberOfPlayers = configs.playerNumber;

        this.initialized =
            this.initializeData(configs.difficulty).catch((reason) => console.log(reason));

        this.packetManager.registerDisconnectHandler((socketId: string) => {
            const INDEX = this.playerIds.findIndex((playerId) => playerId === socketId);
            const FOUND = INDEX >= 0;
            if (FOUND) {
                this.playerIds[INDEX] = null;
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
        const config = {
            difficulty: this.configurationInternal.difficulty,
            gameId: this.id,
            gameMode: this.configurationInternal.gameMode,
            playerNumber: this.numberOfPlayers
        };
        return config;
    }

    public addPlayer(playerId: string): PlayerNumber {
        if (this.playerIds.length < this.numberOfPlayers) {
            this.playerIds.push(playerId);
            this.initialized.then(() => {
                this.communicationHandler.clearPlayerGrid(playerId);
                this.communicationHandler.sendGridWords(playerId, this.words);
                this.communicationHandler.sendDefinitions(playerId, this.definitions);
            }).catch((reason) => console.log(reason));
            if (this.playerIds.length === this.numberOfPlayers) {
                this.start();
            }
            return this.playerIds.length;
        }
        else {
            throw new Error('Cannot add a new player: max number reached.');
        }
    }

    public isPlayerInGame(playerId: string): boolean {
        return this.playerIds.findIndex((id) => id === playerId) >= 0;
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

    private async initializeData(difficulty: Difficulty): Promise<void> {
        this.wordsInternal =
            await GameInitializer.getInstance().initializeGrid(difficulty);
        this.definitionsInternal =
            await GameInitializer.getInstance().getDefinitionsOf(this.words, difficulty);
    }

    private start(): void {
        if (!this.started) {
            this.started = true;
            this.communicationHandler.sendGameStart(this.playerIds);
        }
        else {
            throw new Error('Cannot start game: Game already started.');
        }
    }

    private startTimer() {
        const ONE_SECOND = 1000;
        setInterval(() => {
            this.countdown--;
            this.playerIds.forEach((playerId) => {
                if (playerId !== null) {
                    logger.log('(game #%s) Timer: %d', this.id, this.countdown);
                    this.packetManager.sendPacket(
                        CrosswordTimerPacket,
                        new CrosswordTimerPacket(this.countdown), playerId
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
