import { GridFiller, row,  } from './grid-filler';
import { lexicon } from './englishWords';
import { getRandomIndex } from './lexique';
import { Word } from './word';
import { Grid } from './grid-generator';

export class GridFillerFirstSection extends GridFiller {

    constructor(grid: Grid) {
        super(grid);
        this.firstWordLenght = [3, 6];
        this.secondWordLenght = [3, 4];
        this.thirdWordLenght = [3, 3];
        this.untilWhichRow = 3;
        this.acrossWordLenght = [[3, 9], [3, 4], [3, 3]];
        this.initialisation(grid);
    }
}