import { GridFiller } from './grid-filler';
import { Difficulty } from './grid';
import { GridFillerWordPlacement as WordPlacement } from './grid-filler-word-placement';
import { WordPosition } from './word-position';

export class GridFillerFirstSection extends GridFiller {

    constructor(difficulty: Difficulty) {
        super(difficulty);
        this.acrossWords = [
            new WordPlacement(new WordPosition(0, 0), 6, 9),
            new WordPlacement(new WordPosition(1, 0), 3, 3),
            new WordPlacement(new WordPosition(2, 0), 3, 3)
        ];
        this.verticalWords = [
            new WordPlacement(new WordPosition(0, 0), 5, 8),
            new WordPlacement(new WordPosition(0, 1), 3, 3),
            new WordPlacement(new WordPosition(0, 2), 3, 3)
        ];
    }

}
