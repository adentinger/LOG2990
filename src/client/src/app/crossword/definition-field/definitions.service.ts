import { Injectable, EventEmitter } from '@angular/core';

import { Definition } from '../../common/crossword/definition';
import { DEFINITIONS_MOCK } from '../mocks/definition-mock';
import { CrosswordGameService } from '../crossword-game.service';
import { CrosswordGridService } from '../board/crossword-grid.service';

@Injectable()
export class DefinitionsService {

    private cheatModeOn = false;
    private definitions: Definition[];
    public internalSelectedDefinitionId: number = -1;
    public internalSelectedDefinition: EventEmitter<number> = new EventEmitter<number>();

    public getDefinitions(): Definition[] {
        return this.definitions;
    }
    constructor(public crosswordGameService: CrosswordGameService, public crosswordGridService: CrosswordGridService) {
        this.definitions = DEFINITIONS_MOCK;
    }

    public get selectedDefinitionId() {
        return this.internalSelectedDefinitionId;
    }

    public set selectedDefinitionId(selectedDefinitionId) {
        this.internalSelectedDefinitionId = selectedDefinitionId;

        if (selectedDefinitionId === -1) {
            this.internalSelectedDefinition.emit(null);
        }
        else {
            this.internalSelectedDefinition.emit(selectedDefinitionId);
        }
    }

    public onSelect(index: number, event): void {
        if (this.crosswordGridService.grid[index].string === '') {

            this.selectedDefinitionId = index;
            this.crosswordGameService.selectedWordIndex = index;
            this.crosswordGameService.lastSelectedWordIndex = index;

            this.crosswordGameService.aDefinitionIsSelected = true;
        }
    }

    public onClickOutside(): void {
        this.selectedDefinitionId = -1;
        this.crosswordGameService.selectedWordIndex = 0;

        this.crosswordGameService.aDefinitionIsSelected = false;
    }

    public getCheatModeState(): string {
        return this.cheatModeOn.toString();
    }

    public setCheatModeOnOff(): void {
        this.cheatModeOn = !this.cheatModeOn;
    }
}
