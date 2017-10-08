import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CROSSWORD } from '../mocks/grid-mock';

@Injectable()
export class CrosswordGridService {

    public grid: string[][] = [];
    private url = 'http://localhost:3000/crossword/grid';

    constructor(private http: HttpClient) { };

    public getGrid(): string[][] {
        return this.grid;
    }
    public fetchGrid(): void {
        // return CROSSWORD;
        this.http.get(this.url).subscribe((response: any) => {this.grid = response.grid});
        // .toPromise().then((response: Response) => {this.grid = response.})
    }
}
