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

    private dataOfLatestGeneration: GenerationData;
    private isGenerationScheduled = false;
    private nextGenerationData: CancellationData;

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

        this.nextGenerationData = null;
    }

    protected gridGenerationBase(wordsToInclude: Word[], difficulty: Difficulty): Promise<Grid> {
        if (this.isGenerationScheduled) {
            // Just update the next generation data.
            this.nextGenerationData.difficulty = difficulty;
            this.nextGenerationData.wordsToInclude = wordsToInclude;
            return this.nextGenerationData.promise;
        }
        else {
            this.isGenerationScheduled = true;

            this.nextGenerationData = {
                difficulty: difficulty,
                wordsToInclude: wordsToInclude,
                promise: null
            };

            const promise = this.dataOfLatestGeneration.promise.then(() => {
                // Former generation finished.
                if (this.isGenerationScheduled) {
                    // Start next generation if still scheduled.
                    this.isGenerationScheduled = false;
                    this.dataOfLatestGeneration = this.startGeneration(
                        this.nextGenerationData.wordsToInclude,
                        this.nextGenerationData.difficulty
                    );
                    return this.dataOfLatestGeneration.promise;
                }
                else {
                    // Generation cancelled;
                    return null;
                }
            });
            this.nextGenerationData.promise = promise;
            return promise;
        }
    }

    protected cancelLatestGeneration(): Promise<void> {
        this.isGenerationScheduled = false;
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
