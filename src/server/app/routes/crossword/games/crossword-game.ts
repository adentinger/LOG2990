import { CrosswordGameConfigs, PlayerNumber } from '../../../../../common/src/communication/game-configs';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { DEFINITIONS_MOCK_H, DEFINITIONS_MOCK_V } from '../mocks/definitions-mock';
import { ARRAY_GRIDWORD_H, ARRAY_GRIDWORD_V } from '../mocks/gridwords-mock';
import { Definition } from '../../../../../common/src/crossword/definition';
import { PacketManagerServer } from '../../../packet-manager';
import { CrosswordTimerPacket } from '../../../../../common/src/crossword/packets/crossword-timer.packet';
import '../../../../../common/src/crossword/packets/crossword-timer.parser';
import { PacketEvent, PacketHandler, registerHandlers } from '../../../../../common/src/index';
import { Logger } from '../../../../../common/src/logger';
import '../../../../../common/src/crossword/packets/word-try.parser';
import { Direction, GameMode } from '../../../../../common/src/crossword/crossword-enums';

const logger = Logger.getLogger('CrosswordGame');

const COUNTDOWN_DEFAULT_VALUE = 3600; // 1 minute

export class CrosswordGame {
    private static readonly COUNTDOWN_INITAL = COUNTDOWN_DEFAULT_VALUE;
    private static idCounter = 0;

    public readonly id: number;
    public readonly numberOfPlayers: PlayerNumber;
    public countdown = CrosswordGame.COUNTDOWN_INITAL;

    private packetManager: PacketManagerServer = PacketManagerServer.getInstance();

    public horizontalGridWords: Map<number, GridWord> = new Map();
    public verticalGridWords: Map<number, GridWord> = new Map();

    public verticalDefinitions: Map<number, Definition> = new Map;
    public horizontalDefinitions: Map<number, Definition> = new Map;

    private readonly playerIds: string[] = [];

    private gameMode: GameMode;

    constructor(configs: CrosswordGameConfigs) {
        this.id = CrosswordGame.idCounter++;
        this.numberOfPlayers = configs.playerNumber;
        this.gameMode = configs.gameMode;

        // MOCK : get grid words from mock
        for (let i = 0; i < ARRAY_GRIDWORD_H.length; i++) {
            this.horizontalGridWords.set(ARRAY_GRIDWORD_H[i].id, ARRAY_GRIDWORD_H);
        }
        for (let i = 0; i < ARRAY_GRIDWORD_V.length; i++) {
            this.verticalGridWords.set(ARRAY_GRIDWORD_V[i].id, ARRAY_GRIDWORD_V);
        }

        /// MOCK : will get definitions from lexic by http requests
        for (let i = 0; i < DEFINITIONS_MOCK_V.length; i++) {
            this.verticalDefinitions.set(i, DEFINITIONS_MOCK_V[i]);
        }
        for (let i = 0; i < DEFINITIONS_MOCK_H.length; i++) {
            this.horizontalDefinitions.set(i, DEFINITIONS_MOCK_H[i]);
        }

        this.packetManager.registerDisconnectHandler((socketId: string) => {
            const INDEX = this.playerIds.findIndex((playerId) => playerId === socketId);
            const FOUND = INDEX >= 0;
            if (FOUND) {
                this.playerIds[INDEX] = null;
            }
        });

        registerHandlers(this, this.packetManager);

        if (this.gameMode === GameMode.Dynamic) {
            this.startTimer();
        }
    }

    public addPlayerToGame(playerId: string): PlayerNumber {
        if (this.playerIds.length < this.numberOfPlayers) {
            this.playerIds.push(playerId);
            return this.playerIds.length;
        }
        else {
            throw new Error('Cannot add a new player: max number reached.');
        }
    }

    public isPlayerInGame(playerId: string): boolean {
        return this.playerIds.findIndex((id) => id === playerId) >= 0;
    }

    public getGameInfo(): Object {
        return {
            player1Id: this.playerIds[0],
            player2Id: this.playerIds[1],
            numberOfGridWords: this.getNumberOfWordsInGrid(),
            numberOfDefinitions: this.getNumberOfDefinitions(),
        };
    }

    private getNumberOfDefinitions(): number {
        return this.horizontalDefinitions.size
            + this.verticalDefinitions.size;
    }

    private getNumberOfWordsInGrid(): number {
        return this.horizontalGridWords.size +
            this.verticalGridWords.size;
    }

    private startTimer() {
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
        }, 1000);
    };

    @PacketHandler(CrosswordTimerPacket)
    // tslint:disable-next-line:no-unused-variable
    private getCheatModeTimerValue(event: PacketEvent<CrosswordTimerPacket>) {
        this.countdown = event.value.countdown;
    }

    public validateUserAnswer(wordTry: GridWord): boolean {
        const index = wordTry.id;
        const direction = wordTry.direction;

        if (direction === Direction.horizontal &&
            this.horizontalGridWords.get(index).string === wordTry.string) {
            this.countdown = COUNTDOWN_DEFAULT_VALUE;
            return true;
        }
        else if (direction === Direction.vertical &&
            this.verticalGridWords.get(index).string === wordTry.string) {
            this.countdown = COUNTDOWN_DEFAULT_VALUE;
            return true;
        }
        else {
            return false;
        }
    }

}
