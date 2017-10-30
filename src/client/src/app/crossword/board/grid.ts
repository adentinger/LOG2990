import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { ViewableGrid } from './viewable-grid';

export class Grid {

    public static readonly DIMENSIONS = 10;
    public static readonly BLACK_TILE = '0';
    public static readonly EMPTY_TILE = ' ';

    private words: GridWord[] = [];

    public addWord(word: GridWord): void {
    }

    public empty(): void {
    }

    public computeViewableGrid(): ViewableGrid {
        return null;
    }

}
