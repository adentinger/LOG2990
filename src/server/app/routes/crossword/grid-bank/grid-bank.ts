import { Collection, Db, MongoError } from 'mongodb';

import { Grid } from '../grid-generator/grid';
import { GridGenerator } from '../grid-generator/grid-generator';
import { NormalWordSuggestionsGetter } from '../grid-generator/normal-word-suggestions-getter';
import { Difficulty } from '../../../../../common/src/crossword/difficulty';
import { provideDatabase } from '../../../app-db';

export abstract class GridBank {

    public static readonly COLLECTION_NAME = 'grid-banks';
    private static bank: Collection = GridBank.initializeBank();
    public static readonly NUMBER_OF_GRIDS = 5;

    private static initializeBank(): Collection {
        provideDatabase().then((db: Db) => {
            db.collection(GridBank.COLLECTION_NAME, (error: MongoError, bank: Collection) => {
                this.bank = bank;
            });
        });
        return null;
    }

    public async fillup(): Promise<void> {
        while (await this.askSize() !== GridBank.NUMBER_OF_GRIDS) {
            this.addGridToBank();
        }
    }

    public getGrid(): Promise<Grid> {
        const grid: Promise<Grid> = null;
        this.fillup();
        return grid;
    }

    public askSize(): Promise<number> {
        return new Promise((resolve, reject) => reject());
    }

    public abstract getGridFromGenerator(): Promise<Grid>;

    protected getGridFromGeneratorWithDifficulty(difficulty: Difficulty): Promise<Grid> {
        return GridGenerator.getInstance()
               .gridGeneration(new NormalWordSuggestionsGetter(difficulty));
    }

    private addGridToBank(): void {
        // TODO
    }

}
