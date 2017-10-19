import { Grid } from '../../../common/grid';
import { GridBankEasy } from './grid-bank-easy';
import { GridBankNormal } from './grid-bank-normal';
import { GridBankHard } from './grid-bank-hard';

export class GridBanks {

    private static readonly INSTANCE = new GridBanks();

    private gridBankEasy: GridBankEasy;
    private gridBankNormal: GridBankNormal;
    private gridBankHard: GridBankHard;

    public static getInstance(): GridBanks {
        return GridBanks.INSTANCE;
    }

    private constructor() {
        this.gridBankEasy = new GridBankEasy();
        this.gridBankNormal = new GridBankNormal();
        this.gridBankHard = new GridBankHard();
        this.fillup();
    }

    public async fillup(): Promise<void> {
        await this.gridBankEasy.fillup();
        await this.gridBankNormal.fillup();
        await this.gridBankHard.fillup();
    }

    public getEasyGrid(): Promise<Grid> {
        return this.gridBankEasy.getGrid();
    }

    public getNormalGrid(): Promise<Grid> {
        return this.gridBankNormal.getGrid();    }

    public getHardGrid(): Promise<Grid> {
        return this.gridBankHard.getGrid();
    }

}
