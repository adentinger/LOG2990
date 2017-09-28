import { Injectable } from '@angular/core';

import { CROSSWORD } from '../mocks/grid-mock';

@Injectable()
export class CrosswordGridService {
    public getGrid(): string[][] {
        return CROSSWORD;
    }
}
