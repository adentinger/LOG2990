import { Component, ViewChild, ElementRef, Input, NgZone } from '@angular/core';

import { DefinitionsService, Definitions, Answers } from './definitions.service';
import { Direction, Owner } from '../../../../../common/src/crossword/crossword-enums';
import { GridService } from '../board/grid.service';
import { SelectionService } from '../selection.service';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Definition } from './definition';
import { GameService } from '../game.service';

@Component({
    selector: 'app-definition-field',
    templateUrl: './definition-field.component.html',
    styleUrls: ['./definition-field.component.css']
})
export class DefinitionFieldComponent {

    public readonly HORIZONTAL = Direction.horizontal;
    public readonly VERTICAL = Direction.vertical;
    public verticalCollapsed = true;
    public acrossCollapsed = true;

    @ViewChild('inputBuffer') public inputBuffer: ElementRef;

    public get cheatMode(): boolean {
        return this.gameService.getShowWordsState();
    }

    constructor(private definitionService: DefinitionsService,
                private selectionService: SelectionService,
                private gridService: GridService,
                private gameService: GameService,
                private ngZone: NgZone) {
        this.definitionService.pushOnChangeCallback(() => {
            this.ngZone.run(() => { });
        });
    }

    public get definitions(): Definitions {
        return this.definitionService.definitions;
    }

    public get answers(): Answers {
        return this.definitionService.answers;
    }

    public isDefinitionClickable(index: number, direction: Direction): boolean {
        const isWordFound =
            this.gridService.getWord(index, direction).owner === Owner.none;
        return isWordFound;
    }

    public onDefinitionClicked(index: number, direction: Direction): void {
        if (this.isDefinitionClickable(index, direction)) {
            const SELECTED_WORD: GridWord =
                this.gridService.getWord(index, direction);
            this.selectionService.selection.next(SELECTED_WORD);
        }
    }

    public onClickOutside(): void {
        this.selectionService.selection.next(SelectionService.NO_SELECTION);
    }

    public checkIfSelected(index: number, direction: Direction): boolean {
        return this.selectionService.isDefinitionSelected(
            new Definition(index, direction, '')
        );
    }

    public checkIfFound(index: number, direction: Direction): boolean {
        return this.gridService.checkIfWordIsFound(index, direction);
    }

    public checkDefinitionStatus(index: number, direction: Direction) { }

    public isCollapsedAcross(): void {
        this.acrossCollapsed = !this.acrossCollapsed;
    }

    public isCollapsedVertical(): void {
        this.verticalCollapsed = !this.verticalCollapsed;
    }

}
