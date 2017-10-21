import { Collection, Db, MongoError } from 'mongodb';

import { Grid } from '../grid-generator/grid';
import { GridGenerator } from '../grid-generator/grid-generator';
import { NormalWordSuggestionsGetter } from '../grid-generator/normal-word-suggestions-getter';
import { Difficulty } from '../../../../../common/src/crossword/difficulty';
import { provideDatabase } from '../../../app-db';
import { Logger, warn } from '../../../../../common/src';

enum GridState {
    GENERATING = 0,
    READY,
    CANCELLED
}

export abstract class GridBank {

    public static readonly NUMBER_OF_GRIDS = 5;
    private static readonly COLLECTION_BASE_NAME = 'grid-bank-';

    private difficulty: Difficulty;
    private bank: Collection;
    private logger = Logger.getLogger('GridBank');

    constructor(difficulty: Difficulty) {
        this.difficulty = difficulty;
        this.initializeBank();
    }

    private initializeBank(): Collection {
        provideDatabase().then((db: Db) => {
            db.collection(this.collectionName, (error: MongoError, bank: Collection) => {
                this.bank = bank;
            });
        });
        return null;
    }

    public async fillup(): Promise<void> {
        while (await this.askSize() !== GridBank.NUMBER_OF_GRIDS) {
            await this.requestGridGeneration();
        }
    }

    public getGrid(): Promise<Grid> {
        const grid: Promise<Grid> = null;
        this.fillup();
        return grid;
    }

    public askSize(): Promise<number> {
        return this.bank.count({});
    }

    public abstract getGridFromGenerator(): Promise<Grid>;

    protected getGridFromGeneratorWithDifficulty(difficulty: Difficulty): Promise<Grid> {
        return GridGenerator.getInstance()
               .gridGeneration(new NormalWordSuggestionsGetter(difficulty));
    }

    public requestGridGeneration(): void {
        const GRID_PROMISE =
            GridGenerator.getInstance()
            .gridGeneration(new NormalWordSuggestionsGetter(this.difficulty));
        GRID_PROMISE
            .then((grid) => this.addGridToBank(grid))
            .catch((reason) => {
                warn(this.logger, new Error(reason));
            });
    }

    private addGridToBank(grid: Grid): void {
        this.bank.insertOne(this.makeDocumentFrom(grid, GridState.READY))
            .catch((reason) => {
                warn(this.logger, new Error(reason));
            });
    }

    private get collectionName(): string {
        return GridBank.COLLECTION_BASE_NAME + this.difficulty.toString();
    }

    private makeDocumentFrom(grid: Grid, state: GridState) {
        const STATEFUL_GRID = {...grid, state: state};
        return STATEFUL_GRID;
    }

}
