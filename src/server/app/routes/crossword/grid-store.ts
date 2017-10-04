import { Grid } from '../../../../common/grid';
import { GRID_MOCK } from './grid-mock';

const N_STORED_GRID = 5;

export class GridStore {

    private gridArray: Grid[];
    public getGrid(): Promise<Grid> {
        return new Promise(resolve => this.gridArray.pop()) ;
    }
    constructor() {
        for (let i = 0; i < N_STORED_GRID; i++) {
            this.gridArray.push(GRID_MOCK);    // MOCK
        }
    }
}
