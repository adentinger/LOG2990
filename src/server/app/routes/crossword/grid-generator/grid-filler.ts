import { GridFillerWordPlacement as WordPlacement } from './grid-filler-word-placement';
import { Grid } from './grid';
import { Difficulty } from './difficulty';
import { LexiconCaller } from '../lexic/lexicon-caller';

export const WORD_SEARCH_MAX_ATTEMPT = 200;
export enum column { first, second, third }
export enum row { first, second, third }

export abstract class GridFiller {

    protected acrossWords: WordPlacement[] = [];
    protected verticalWords: WordPlacement[] = [];
    protected difficulty: Difficulty;

    constructor(difficulty: Difficulty) {
        this.difficulty = difficulty;
    }

    public get acrossPlacement(): WordPlacement[] {
        return this.acrossWords.slice();
    }

    public get verticalPlacement(): WordPlacement[] {
        return this.verticalWords.slice();
    }

    public async fill(grid: Grid): Promise<void> {
        await this.placeAcrossWords(grid);
        await this.placeVerticalWords(grid);
    }

    private async placeAcrossWords(grid: Grid): Promise<void> {
        // We assume that the words in acrossWords and verticalWords
        // are given top to bottom and left to right (respectively).
    }

    private async placeVerticalWords(grid: Grid): Promise<void> {
        this.verticalWords.forEach((placement) => {
            LexiconCaller.getInstance().getWords(placement.minLength,
                                              placement.maxLength,
                                              this.difficulty.isWordCommon());
        });
    }

}

