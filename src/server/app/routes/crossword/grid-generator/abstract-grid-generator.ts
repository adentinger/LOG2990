import { Grid } from './grid';
import { GridFiller } from './grid-filler';
import { GridFillerContainer } from './grid-filler-container';
import { WordSuggestionsGetter } from './word-suggestions-getter';
import { Word } from '../word';

interface GenerationData {
    grid: Grid;
    filler: GridFiller;
    promise: Promise<Grid>;
}

enum State {
    STOPPED = 0,
    RUNNING,
    CANCELLING,
    CANCELLING_GENERATION_REQUESTED
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

    protected gridGenerationBase(wordsToInclude: Word[], suggestionsGetter: WordSuggestionsGetter): Promise<Grid> {
        this.dataOfLatestGeneration = this.startGeneration(wordsToInclude, suggestionsGetter);
        return this.dataOfLatestGeneration.promise;
    }

    protected cancelLatestGeneration(): Promise<void> {
        this.dataOfLatestGeneration.filler.cancelFilling();
        return this.dataOfLatestGeneration.promise
            .then (() => { return; })
            .catch();
    }

    private startGeneration(wordsToInclude: Word[], suggestionsGetter: WordSuggestionsGetter): GenerationData {
        const generationData: GenerationData = {
            grid: null,
            filler: null,
            promise: null
        };
        generationData.promise = new Promise((resolve, reject) => {
            generationData.grid = new Grid(wordsToInclude);
            generationData.filler = new GridFillerContainer(suggestionsGetter);
            generationData.grid.fillUsing(generationData.filler)
                .then(() => resolve(generationData.grid))
                .catch(() => resolve(null));
        });

        return generationData;
    }

}
