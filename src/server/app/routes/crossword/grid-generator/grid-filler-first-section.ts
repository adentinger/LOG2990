import { GridFiller, row,  } from './grid-filler';
import { WordCaller} from './WordCaller';
import { GridGenerator } from './grid-generator';

export class GridFillerFirstSection extends GridFiller {

    constructor(grid: GridGenerator, isCommon: boolean) {
        super(grid, isCommon);
        this.firstWordLenght = [3, 6];
        this.secondWordLenght = [3, 4];
        this.thirdWordLenght = [3, 3];
        this.untilWhichRow = 3;
        this.acrossWordLenght = [[3, 9], [3, 4], [3, 3]];
        this.initialisation(grid);
    }
}