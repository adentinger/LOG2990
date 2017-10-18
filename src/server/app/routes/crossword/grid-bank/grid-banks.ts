import { HttpStatus } from '../../../common/http-status';
import { Grid } from '../../../common/grid';

export class GridBanks {

    private static readonly INSTANCE = new GridBanks();
	
	private gridBankEasy: GridBankEasy;
	private gridBankNormal: GridBankNormal;
	private gridBankHard: GridBankHard;

    public static getInstance(): GridBanks {
        return GridBanks.INSTANCE;
    }

    private constructor() {
		gridBankEasy = new GridBankEasy();
		gridBankNormal = new GridBankNormal();
		gridBankHard = new gridBankHard();
	}

    public async fillup(): Promise<void> {
		await gridBankEasy.fillup();
		await gridBankNormal.fillup();
		await gridBankHard.fillup();
    }

    public getEasyGrid(): Promise<Grid> {
        return gridBankEasy.getGrid();
    }

    public getNormalGrid(): Promise<Grid> {
		return gridBankNormal.getGrid();    }

    public getHardGrid(): Promise<Grid> {
        return gridBankHard.getGrid();
    }

}
