import { Injectable } from '@angular/core';

import { CROSSWORD } from '../mocks/mock-grid';

@Injectable()
export class CrosswordGridService {
    public getGrid(): string[][] {
        return CROSSWORD;
    }
}
