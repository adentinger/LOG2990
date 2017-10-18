import { Grid } from '../../../common/grid';
import * as http from 'http';

export abstract class GridBank {

    public static readonly NUMBER_OF_GRIDS = 5;
	
	private bank: Promise<Grid>[] = [];
	
	public async fillup(): Promise<void> {
		while (this.getSize() != NUMBER_OF_GRIDS){
			this.addGridToBank(); 
		}
    }

    public getGrid(): Promise<Grid> {
        const grid:Promise<Grid> = this.bank.shift();
		this.fillup();
		return grid;
    }

    public getSize(): number {
        return this.bank.length;
    }
	
	private getGridFromGenerator(url:string): Promise<Grid>{
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

	private addGridToBank(): void{
		this.bank.push(this.getGridFromGenerator());
	}

}
