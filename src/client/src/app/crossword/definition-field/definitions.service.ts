import { Injectable } from '@angular/core';

import { Definition } from './class/definition';
import { DEFINITIONS_MOCK } from '../mocks/definition-mock';

@Injectable()
export class DefinitionsService {
    public getDefinitions(): Definition[] {
        return DEFINITIONS_MOCK;
    }
}
