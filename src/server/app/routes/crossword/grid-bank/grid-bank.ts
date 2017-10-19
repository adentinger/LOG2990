import { Grid } from '../grid-generator/grid';
import { GridGenerator } from '../grid-generator/grid-generator';
import { NormalWordSuggestionsGetter } from '../grid-generator/normal-word-suggestions-getter';
import { Difficulty } from '../../../common/crossword/difficulty';

export abstract class GridBank {

    public static readonly NUMBER_OF_GRIDS = 1;

    protected bank: Promise<Grid>[] = [];

    public async fillup(): Promise<void> {
        while (this.size !== GridBank.NUMBER_OF_GRIDS) {
            this.addGridToBank();
        }
    }

    public getGrid(): Promise<Grid> {
        const grid: Promise<Grid> = this.bank.shift();
        this.fillup();
        return grid;
    }

    public get size(): number {
        return this.bank.length;
    }

    protected abstract getGridFromGenerator(): Promise<Grid>;

    protected getGridFromGeneratorWithUrl(difficulty: Difficulty): Promise<Grid> {
        return GridGenerator.getInstance()
               .gridGeneration(new NormalWordSuggestionsGetter(difficulty));
    }

    private addGridToBank(): void {
        this.bank.push(this.getGridFromGenerator());
    }

}
