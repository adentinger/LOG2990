import { CrosswordGameConfigs, PlayerNumber } from '../../../../../common/src/communication/game-configs';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { DEFINITIONS_MOCK_H, DEFINITIONS_MOCK_V } from '../mocks/definitions-mock';
import { Definition } from '../../../../../common/src/crossword/definition';
import { PacketManagerServer } from '../../../packet-manager';
import { CrosswordTimerPacket } from '../../../../../common/src/crossword/packets/crossword-timer.packet';
import '../../../../../common/src/crossword/packets/crossword-timer.parser';
import { PacketEvent, PacketHandler, registerHandlers } from '../../../../../common/src/index';
import { Logger } from '../../../../../common/src/logger';
import '../../../../../common/src/crossword/packets/word-try.parser';
import { GameMode, Difficulty } from '../../../../../common/src/crossword/crossword-enums';
import { GridBanks } from '../grid-bank/grid-banks';
import { Grid } from '../grid-generator/grid';

const logger = Logger.getLogger('CrosswordGame');

const COUNTDOWN_DEFAULT_VALUE = 3600; // 1 minute

export class CrosswordGame {
    private static readonly COUNTDOWN_INITAL = COUNTDOWN_DEFAULT_VALUE;
    private static idCounter = 0;

    public readonly id: number;
    public readonly numberOfPlayers: PlayerNumber;
    public countdown = CrosswordGame.COUNTDOWN_INITAL;

    private packetManager: PacketManagerServer = PacketManagerServer.getInstance();

    private wordsInternal: GridWord[] = [];

    private definitionsInternal: Definition[] = [];

    private readonly playerIds: string[] = [];

    private gameMode: GameMode;

    constructor(configs: CrosswordGameConfigs) {
        this.id = CrosswordGame.idCounter++;
        this.numberOfPlayers = configs.playerNumber;
        this.gameMode = configs.gameMode;

        this.fetchGrid(configs.difficulty).catch((reason) => console.log(reason));

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

    public get words(): GridWord[] {
        return this.wordsInternal.slice();
    }

    public get definitionsWithIndex(): [Definition, number][] {
        const DEFINITIONS_WITH_INDEX: [Definition, number][] = [];
        this.definitionsInternal.forEach((definition, index) => {
            DEFINITIONS_WITH_INDEX.push([definition, index]);
        });
        return DEFINITIONS_WITH_INDEX;
    }

    public addPlayer(playerId: string): PlayerNumber {
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

    private async fetchGrid(difficulty: Difficulty): Promise<void> {
        let grid: Grid;
        switch (difficulty) {
            case Difficulty.easy: {
                 grid = await GridBanks.getInstance().getEasyGrid();
                break;
            }
            case Difficulty.medium: {
                grid = await GridBanks.getInstance().getNormalGrid();
                break;
            }
            case Difficulty.hard: {
                grid = await GridBanks.getInstance().getHardGrid();
                break;
            }
            default: throw new Error(`Unknown difficulty: ${difficulty}`);
        }
        console.log(grid);

        /// MOCK : will get definitions from lexic by http requests
        for (let i = 0; i < DEFINITIONS_MOCK_V.length; i++) {
            this.definitionsInternal.push(DEFINITIONS_MOCK_V[i]);
        }
        for (let i = 0; i < DEFINITIONS_MOCK_H.length; i++) {
            this.definitionsInternal.push(DEFINITIONS_MOCK_H[i]);
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
