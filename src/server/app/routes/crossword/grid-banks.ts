import { HttpStatus } from '../../http-response-status';
import { Grid } from '../../common/grid';

export class GridBankMiddleware {

    private static readonly INSTANCE = new GridBankMiddleware();

    public static getInstance(): GridBankMiddleware {
        return GridBankMiddleware.INSTANCE;
    }

    private constructor() {}

    public fillup(): void {
        return;
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
