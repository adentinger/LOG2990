import { Injectable } from '@angular/core';

import { CROSSWORD } from './mock-grid';

@Injectable()
export class CrosswordGridService {
    public getGrid(): string[][] {
        return CROSSWORD;
    }
}
