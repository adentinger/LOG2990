import { GridBank } from './grid-bank';
import { Grid } from '../grid-generator/grid';
import { DifficultyHard } from '../../../../../common/src/crossword/difficulty-hard';

export class GridBankHard extends GridBank {

    public getGridFromGenerator(): Promise<Grid> {
        return this.getGridFromGeneratorWithUrl(new DifficultyHard());
    }

}
