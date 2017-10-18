import { HttpStatus } from '../../../common/http-status';
import { GridBank } from './grid-bank';
import { Grid } from '../../../common/grid';

export class GridBankHard implements GridBank {

    public getGridFromGenerator: Promise<Grid>{
		GridBank.getGridFromGenerator('http://localhost:3000/crossword/grid-generator/hard');
	}
}
