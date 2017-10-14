import { Grid } from '../../../common/grid';

export abstract class GridBank {

    public static readonly NUMBER_OF_GRIDS = 5;

    public abstract fillup(): Promise<void>;
    public abstract getGrid(): Promise<Grid>;

}
