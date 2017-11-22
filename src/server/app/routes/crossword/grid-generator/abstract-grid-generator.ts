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

interface CancellationData {
    promise: Promise<Grid>;
    wordsToInclude: Word[];
    difficulty: Difficulty;
}

export abstract class AbstractGridGenerator {

    private latestGeneration: GenerationData;
    private isGenerationScheduled = false;

    protected get latestGrid(): Promise<Grid> {
        return this.latestGeneration.promise;
    }

    protected constructor() {
        const EMPTY_GRID = new Grid();
        this.latestGeneration = {
            filler: null,
            grid: EMPTY_GRID,
            promise: Promise.resolve(EMPTY_GRID)
        };
    }

    protected gridGenerationBase(wordsToInclude: Word[], difficulty: Difficulty): Promise<Grid> {
        if (this.isGenerationScheduled) {
            // Just update the generation parameters.
            this.latestGeneration.grid = new Grid(wordsToInclude);
            this.latestGeneration.filler = new GridFillerContainer(difficulty);
        }
        else {
            this.startGeneration(wordsToInclude, difficulty);
        }
        return this.latestGeneration.promise;
    }

    protected cancelLatestGeneration(): Promise<void> {
        this.isGenerationScheduled = false;
        this.latestGeneration.filler.cancelFilling();
        return this.latestGeneration.promise
            .then (() => { return; })
            .catch();
    }

    private startGeneration(wordsToInclude: Word[], difficulty: Difficulty): void {

        const generationData: GenerationData = {
            grid: new Grid(wordsToInclude),
            filler: new GridFillerContainer(difficulty),
            promise: null
        };

        this.isGenerationScheduled = true;
        const promise = this.latestGeneration.promise.then(() => {
            // Former generation finished.
            if (this.isGenerationScheduled) {
                // Start next generation if still scheduled.
                this.isGenerationScheduled = false;
                return generationData.grid.fillUsing(generationData.filler)
                    .then(() => generationData.grid)
                    .catch(() => null);
            }
            else {
                // Generation cancelled.
                return null;
            }
        });

        generationData.promise = promise;
        this.latestGeneration = generationData;
    }

}
