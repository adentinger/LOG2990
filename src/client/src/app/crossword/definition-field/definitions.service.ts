import { Injectable } from '@angular/core';

import { Definition } from '../../common/crossword/definition';
import { DEFINITIONS_MOCK } from '../mocks/definition-mock';
import { CrosswordGameService } from '../crossword-game.service';

@Injectable()
export class DefinitionsService {

    private definitions: Definition[];

    public getDefinitions(): Definition[] {
        return this.definitions;
    }
    constructor(public crosswordGameService: CrosswordGameService) {
        this.definitions = DEFINITIONS_MOCK;
    }
}
