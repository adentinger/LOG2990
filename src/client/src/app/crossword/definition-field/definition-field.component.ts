import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { Definition } from '../../../../../common/src/crossword/definition';
import { DefinitionsService } from './definitions.service';
import { Direction } from '../../../../../common/src/crossword/crossword-enums';
import { CrosswordGridService } from '../board/crossword-grid.service';
import { SelectionService } from '../selection.service';

@Component({
    selector: 'app-definition-field',
    templateUrl: './definition-field.component.html',
    styleUrls: ['./definition-field.component.css']
})
export class DefinitionFieldComponent implements OnInit {

    public readonly HORIZONTAL = Direction.horizontal;
    public readonly VERTICAL = Direction.vertical;

    @ViewChild('inputBuffer') public inputBuffer: ElementRef;

    @Input() public cheatMode: boolean;

    @Output() public selectedDefinition: EventEmitter<number> = new EventEmitter<number>();

    public answers: string[] = [];

    constructor(private definitionService: DefinitionsService,
        private selectionService: SelectionService,
        private crosswordGridService: CrosswordGridService) {
        this.selectedDefinition = definitionService.internalSelectedDefinition;
    }

    public get horizontalDefinitions(): Definition[] {
        return <Definition[]>Array.from(this.definitionService.horizontalDefinitions.values());
    }

    public get verticalDefinitions(): Definition[] {
        return <Definition[]>Array.from(this.definitionService.verticalDefinitions.values());
    }

    public ngOnInit(): void {
        this.answers = this.definitionService.getAnswers();
    }

    public get selectedDefinitionId() {
        return this.definitionService.selectedDefinitionId;
    }

    public set selectedDefinitionId(selectedDefinitionId) {
        this.definitionService.selectedDefinitionId = selectedDefinitionId;
    }

    public get selectedDirection() {
        return this.definitionService.selectedDirection;
    }

    public onSelect(index: number, direction: Direction, event): void {
        this.selectionService.selection = {
            index: index,
            direction: direction,
        };

        // TODO migrate to selection service
        if (direction === Direction.horizontal) {
            if (this.crosswordGridService.horizontalGridWords.get(index).string === '') {
                this.definitionService.onSelect(index, direction, event);
            }
        } else if (direction === Direction.vertical) {
            if (this.crosswordGridService.verticalGridWords.get(index).string === '') {
                this.definitionService.onSelect(index, direction, event);
            }
        }
    }
    public onClickOutside(): void {
        this.selectionService.selection = {
            index: -1,
            direction: 0, // don't care
        };
        this.definitionService.onClickOutside();
    }
    public checkIfSelected(index: number, direction: Direction) {
        return (index === this.selectionService.selection.index
            && direction === this.selectionService.selection.direction);
    }
}
