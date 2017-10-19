import { Grid } from '../../../common/grid';
import * as http from 'http';

export abstract class GridBank {

    public static readonly NUMBER_OF_GRIDS = 1;

    protected bank: Promise<Grid>[] = [];

    public async fillup(): Promise<void> {
        while (this.size !== GridBank.NUMBER_OF_GRIDS) {
            this.addGridToBank();
        }
    }

    public getGrid(): Promise<Grid> {
        const grid: Promise<Grid> = this.bank.shift();
        this.fillup();
        return grid;
    }

    public get size(): number {
        return this.bank.length;
    }

    protected abstract getGridFromGenerator(): Promise<Grid>;

    protected getGridFromGeneratorWithUrl(url: string): Promise<Grid> {
        return new Promise((resolve, reject) => {
            http.get(url, (response: http.IncomingMessage) => {
                let data = '';
                response.on('data', (chunk) => data += chunk);
                response.on('end', () => {
                    resolve(JSON.parse(data));
                });
                response.on('error', reject);
            });
        });
    }

    private addGridToBank(): void {
        this.bank.push(this.getGridFromGenerator());
    }

}
