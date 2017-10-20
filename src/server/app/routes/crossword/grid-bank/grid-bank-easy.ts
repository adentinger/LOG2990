import { GridBank } from './grid-bank';
import { Grid } from '../grid-generator/grid';
import { DifficultyEasy } from '../../../common/crossword/difficulty-easy';

export class GridBankEasy extends GridBank {

    public getGridFromGenerator(): Promise<Grid> {
        return this.getGridFromGeneratorWithUrl(new DifficultyEasy());
    }

}
