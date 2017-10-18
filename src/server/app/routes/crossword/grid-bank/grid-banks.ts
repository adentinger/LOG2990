import { HttpStatus } from '../../../common/http-status';
import { Grid } from '../../../common/grid';

export class GridBanks {

    private static readonly INSTANCE = new GridBanks();

    public static getInstance(): GridBanks {
        return GridBanks.INSTANCE;
    }

    private constructor() {}

    public fillup(): Promise<void> {
        return Promise.reject(HttpStatus.NOT_IMPLEMENTED);
    }

    public getEasyGrid(): Promise<Grid> {
        return Promise.reject(HttpStatus.NOT_IMPLEMENTED);
    }

    public getNormalGrid(): Promise<Grid> {
        return Promise.reject(HttpStatus.NOT_IMPLEMENTED);
    }

    public getHardGrid(): Promise<Grid> {
        return Promise.reject(HttpStatus.NOT_IMPLEMENTED);
    }

}
