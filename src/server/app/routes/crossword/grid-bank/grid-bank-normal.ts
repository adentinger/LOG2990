import { GridBank } from './grid-bank';
import { Grid } from '../../../common/grid';

export class GridBankNormal extends GridBank {

    public getGridFromGenerator(): Promise<Grid> {
        return this.getGridFromGeneratorWithUrl('http://localhost:3000/crossword/grid-generator/normal');
    }

}
