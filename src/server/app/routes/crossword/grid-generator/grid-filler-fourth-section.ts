import { GridFiller } from './grid-filler';
import { Difficulty } from './difficulty';
import { GridFillerWordPlacement as WordPlacement } from './grid-filler-word-placement';
import { WordPosition } from './word-position';

export class GridFillerFourthSection extends GridFiller {

    constructor(difficulty: Difficulty) {
        super(difficulty);
        this.verticalWords = [
            new WordPlacement(new WordPosition(1, 9), 4, 5)
        ];
    }

}
