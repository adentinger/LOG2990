import { HttpStatus } from '../../../http-response-status';
import { GridBank } from './grid-bank';
import { Grid } from '../../../common/grid';

export class GridBankHard implements GridBank {

    public fillup(): Promise<void> {
        return Promise.reject(HttpStatus.NOT_IMPLEMENTED);
    }

    public getGrid(): Promise<Grid> {
        return Promise.reject(HttpStatus.NOT_IMPLEMENTED);
    }

}
