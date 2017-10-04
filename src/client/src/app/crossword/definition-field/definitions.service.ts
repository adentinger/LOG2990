import { Injectable } from '@angular/core';

import { Definition } from './class/definition';
import { DEFINITIONS_MOCK } from '../mocks/definition-mock';

@Injectable()
export class DefinitionsService {

    private definitions: Definition[];

    public getDefinitions(): Definition[] {
        return this.definitions;
    }
    constructor() {
        this.definitions = DEFINITIONS_MOCK;
    }
}
