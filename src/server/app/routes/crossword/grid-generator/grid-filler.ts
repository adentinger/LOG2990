import { WordPlacement } from './word-placement';
import { Grid } from './grid';

export const WORD_SEARCH_MAX_ATTEMPT = 200;
export enum column { first, second, third }
export enum row { first, second, third }

export abstract class GridFiller {

    protected acrossWords: WordPlacement[];
    protected verticalWords: WordPlacement[];

    public async fill(grid: Grid): Promise<void> {
        await null;
    }

}

