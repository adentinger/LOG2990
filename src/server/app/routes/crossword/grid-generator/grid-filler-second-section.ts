import { GridFiller } from './grid-filler';
import { lexicon } from './englishWords';
import { getRandomIndex } from './lexique';
import { Word } from './word';
import { GridGenerator } from './grid-generator';

enum row {first, second, third, fourth}

export class GridFillerSecondSection extends GridFiller {

    constructor(grid: GridGenerator) {
        super(grid);
        this.acrossWordLenght = [[3, 5], [3, 3], [3, 5], [3, 3]];
        this.firstWordLenght = [3, 4];
        this.secondWordLenght = [3, 4];
        this.thirdWordLenght = [3, 3];
        this.untilWhichRow = 4;
        this.initialisation(grid);
    }
}