import { CrosswordGameConfigs, PlayerNumber } from '../../../../../common/src/communication/game-configs';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Definition } from '../../../../../common/src/crossword/definition';
import { PacketManagerServer } from '../../../packet-manager';
import { CrosswordTimerPacket } from '../../../../../common/src/crossword/packets/crossword-timer.packet';
import '../../../../../common/src/crossword/packets/crossword-timer.parser';
import { PacketEvent, PacketHandler, registerHandlers } from '../../../../../common/src/index';
import { Logger } from '../../../../../common/src/logger';
import '../../../../../common/src/crossword/packets/word-try.parser';
import { GameMode, Difficulty, Direction, Owner } from '../../../../../common/src/crossword/crossword-enums';
import { GridBanks } from '../grid-bank/grid-banks';
import { Grid } from '../grid-generator/grid';

const logger = Logger.getLogger('CrosswordGame');

const COUNTDOWN_DEFAULT_VALUE = 3600; // 1 minute

export interface DefinitionWithIndex {
    definition: Definition;
    index: number;
}

export class CrosswordGame {
    private static readonly COUNTDOWN_INITAL = COUNTDOWN_DEFAULT_VALUE;
    private static idCounter = 0;

    public readonly id: number;
    public readonly numberOfPlayers: PlayerNumber;
    public countdown = CrosswordGame.COUNTDOWN_INITAL;

    private packetManager: PacketManagerServer = PacketManagerServer.getInstance();

    private wordsInternal: GridWord[] = [];

    private definitionsInternal: DefinitionWithIndex[] = [];

    private readonly playerIds: string[] = [];

    private gameMode: GameMode;

    constructor(configs: CrosswordGameConfigs) {
        this.id = CrosswordGame.idCounter++;
        this.numberOfPlayers = configs.playerNumber;
        this.gameMode = configs.gameMode;

        this.initializeGridData(configs.difficulty).catch((reason) => console.log(reason));

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

    public get definitions(): DefinitionWithIndex[] {
        return this.definitionsInternal.slice();
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

    private async initializeGridData(difficulty: Difficulty): Promise<void> {
        const GRID = await this.fetchGrid(difficulty);
        this.wordsInternal = this.makeWordsFromGrid(GRID);
        await this.assignDefinitions();
    }

    private async fetchGrid(difficulty: Difficulty): Promise<Grid> {
        switch (difficulty) {
            case Difficulty.easy: {
                return await GridBanks.getInstance().getEasyGrid();
            }
            case Difficulty.medium: {
                return await GridBanks.getInstance().getNormalGrid();
            }
            case Difficulty.hard: {
                return await GridBanks.getInstance().getHardGrid();
            }
            default: throw new Error(`Unknown difficulty: ${difficulty}`);
        }
    }

    private makeWordsFromGrid(grid: Grid): GridWord[] {
        const HORIZONTAL_WORDS: GridWord[] =
            grid.across.map(
                (word, index) =>
                    new GridWord(
                        index + 1,
                        word.position.row,
                        word.position.column,
                        word.value.length,
                        Direction.horizontal,
                        Owner.none,
                        word.value
                    )
            );
        const VERTICAL_WORDS: GridWord[] =
            grid.vertical.map(
                (word, index) =>
                    new GridWord(
                        index + 1,
                        word.position.row,
                        word.position.column,
                        word.value.length,
                        Direction.vertical,
                        Owner.none,
                        word.value
                    )
            );

        return HORIZONTAL_WORDS.concat(VERTICAL_WORDS);
    }

    private async assignDefinitions(): Promise<void> {
        const DEFINITIONS: DefinitionWithIndex[] = [];

        let currentHorizontalId = 1;
        let currentVerticalId = 1;
        for (let i = 0; i < this.words.length; ++i) {
            const WORD = this.words[i];

            let index;
            if (WORD.direction === Direction.horizontal) {
                index = currentHorizontalId;
                ++currentHorizontalId;
            }
            else {
                index = currentVerticalId;
                ++currentVerticalId;
            }

            const DEFINITION_WITH_INDEX = {
                definition: new Definition(
                    'CHUCK NORRIS IS SO COOL',
                    WORD.direction
                ),
                index: index
            };
            this.definitionsInternal.push(DEFINITION_WITH_INDEX);
        }

        this.definitionsInternal = DEFINITIONS;
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
