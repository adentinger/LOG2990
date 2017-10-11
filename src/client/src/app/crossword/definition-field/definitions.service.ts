import { Injectable, EventEmitter } from '@angular/core';

import { Definition } from './class/definition';
import { DEFINITIONS_MOCK } from '../mocks/definition-mock';
import { CrosswordGameService } from '../crossword-game.service';

@Injectable()
export class DefinitionsService {

    private definitions: Definition[];
    public _selectedDefinitionId: number = -1;
    public _selectedDefinition: EventEmitter<number> = new EventEmitter<number>();

    public getDefinitions(): Definition[] {
        return this.definitions;
    }
    constructor(public crosswordGameService: CrosswordGameService) {
        this.definitions = DEFINITIONS_MOCK;
    }

    public get selectedDefinitionId() {
        return this._selectedDefinitionId;
    }

    public set selectedDefinitionId(selectedDefinitionId) {
        this._selectedDefinitionId = selectedDefinitionId;

        if (selectedDefinitionId === -1) {
            this._selectedDefinition.emit(null);
        }
        else {
            this._selectedDefinition.emit(selectedDefinitionId);            
        }
    }

    public onSelect(index: number, event): void {
        this.selectedDefinitionId = index;
        this.crosswordGameService.selectedWordIndex = index;

        this.crosswordGameService.aDefinitionIsSelected = true;
    }

    public onClickOutside(): void {
        this.selectedDefinitionId = -1;
        this.crosswordGameService.selectedWordIndex = 0;

        this.crosswordGameService.aDefinitionIsSelected = false;
    }
}
