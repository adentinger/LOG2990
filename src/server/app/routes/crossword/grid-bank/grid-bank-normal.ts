import { GridBank } from './grid-bank';
import { Grid } from '../grid-generator/grid';
import { DifficultyNormal } from '../../../common/crossword/difficulty-normal';

export class GridBankNormal extends GridBank {

    public getGridFromGenerator(): Promise<Grid> {
        return this.getGridFromGeneratorWithUrl(new DifficultyNormal());
    }

}
