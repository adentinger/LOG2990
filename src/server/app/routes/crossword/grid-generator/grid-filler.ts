import { GridFillerWordPlacement as WordPlacement } from './grid-filler-word-placement';
import { Grid } from './grid';
import { Difficulty } from './difficulty';

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
        await this.placeAcrossWords();
        await this.placeVerticalWords();
    }

    private async placeAcrossWords(): Promise<void> {
        await null;
    }

    private async placeVerticalWords(): Promise<void> {
        await null;
    }

}

