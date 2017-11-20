import { Grid } from './grid';
import { GridFiller } from './grid-filler';
import { GridFillerContainer } from './grid-filler-container';
import { Word } from '../word';
import { Difficulty } from '../../../../../common/src/crossword/difficulty';

interface GenerationData {
    grid: Grid;
    filler: GridFiller;
    promise: Promise<Grid>;
}

export abstract class AbstractGridGenerator {

    private dataOfLatestGeneration: GenerationData;

    protected get latestGeneration(): Promise<Grid> {
        return this.dataOfLatestGeneration.promise;
    }

    protected constructor() {
        const EMPTY_GRID = new Grid();
        this.dataOfLatestGeneration = {
            filler: null,
            grid: EMPTY_GRID,
            promise: Promise.resolve(EMPTY_GRID)
        };
    }

    protected gridGenerationBase(wordsToInclude: Word[], difficulty: Difficulty): Promise<Grid> {
        return this.dataOfLatestGeneration.promise.then(() => {
            this.dataOfLatestGeneration = this.startGeneration(wordsToInclude, difficulty);
            return this.dataOfLatestGeneration.promise;
        });
    }

    protected cancelLatestGeneration(): Promise<void> {
        this.dataOfLatestGeneration.filler.cancelFilling();
        return this.dataOfLatestGeneration.promise
            .then (() => { return; })
            .catch();
    }

    private startGeneration(wordsToInclude: Word[], difficulty: Difficulty): GenerationData {
        const generationData: GenerationData = {
            grid: null,
            filler: null,
            promise: null
        };
        generationData.promise = new Promise((resolve, reject) => {
            generationData.grid = new Grid(wordsToInclude);
            generationData.filler = new GridFillerContainer(difficulty);
            generationData.grid.fillUsing(generationData.filler)
                .then(() => resolve(generationData.grid))
                .catch(() => resolve(null));
        });

        return generationData;
    }

}
