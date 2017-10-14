import { Grid } from '../../../common/grid';

export interface GridBank {

    fillup(): Promise<void>;
    getGrid(): Promise<Grid>;

}
