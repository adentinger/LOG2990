import { GridFiller } from './grid-filler';
import { Difficulty } from './difficulty';
import { GridFillerWordPlacement as WordPlacement } from './grid-filler-word-placement';
import { WordPosition } from './word-position';

export class GridFillerSecondSection extends GridFiller {

    constructor(difficulty: Difficulty) {
        super(difficulty);
        this.acrossWords = [
            new WordPlacement(new WordPosition(3, 3), 3, 5),
            new WordPlacement(new WordPosition(4, 3), 3, 3),
            new WordPlacement(new WordPosition(5, 3), 3, 5),
            new WordPlacement(new WordPosition(6, 3), 3, 3)
        ];
        this.verticalWords = [
            new WordPlacement(new WordPosition(3, 3), 4, 4),
            new WordPlacement(new WordPosition(3, 4), 4, 4),
            new WordPlacement(new WordPosition(3, 5), 4, 4)
        ];
    }

}
