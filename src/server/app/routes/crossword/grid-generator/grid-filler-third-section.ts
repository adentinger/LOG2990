import { GridFiller } from './grid-filler';
import { Difficulty } from './difficulty';
import { GridFillerWordPlacement as WordPlacement } from './grid-filler-word-placement';
import { WordPosition } from './word-position';

export class GridFillerThirdSection extends GridFiller {

    constructor(difficulty: Difficulty) {
        super(difficulty);
        this.acrossWords = [
            new WordPlacement(new WordPosition(7, 6), 3, 3),
            new WordPlacement(new WordPosition(8, 6), 3, 3),
            new WordPlacement(new WordPosition(9, 2), 8, 8)
        ];
        this.verticalWords = [
            new WordPlacement(new WordPosition(7, 6), 3, 3),
            new WordPlacement(new WordPosition(7, 7), 3, 3),
            new WordPlacement(new WordPosition(7, 8), 3, 3)
        ];
    }

}
