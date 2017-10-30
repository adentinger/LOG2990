import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { ViewableGrid } from './viewable-grid';

export class Grid {

    private words: GridWord[] = [];

    public addWord(word: GridWord): void {
    }

    public empty(): void {
    }

    public computeViewableGrid(): ViewableGrid {
        return null;
    }

}
