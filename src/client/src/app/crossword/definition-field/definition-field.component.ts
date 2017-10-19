import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { Definition } from '../../common/crossword/definition';
import { DefinitionsService } from './definitions.service';
import { Direction } from '../../common/crossword/crossword-enums';
import { CrosswordGridService } from '../board/crossword-grid.service';

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

    // public definitions: Definition[] = [];

    public answers: string[] = [];

    constructor(private definitionService: DefinitionsService, private crosswordGridService: CrosswordGridService) {
        this.selectedDefinition = definitionService.internalSelectedDefinition;
    }

    public get horizontalDefinitions(): Definition[] {
        return <Definition[]>Array.from(this.definitionService.horizontalDefinitions.values());
    }

    public get verticalDefinitions(): Definition[] {
        return <Definition[]>Array.from(this.definitionService.verticalDefinitions.values());
    }

    public ngOnInit(): void {
        // this.definitions = this.definitionService.getDefinitions();
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
        if (this.crosswordGridService.grid[index].string === '') {
            this.definitionService.onSelect(index, direction, event);
        }
    }

    public onClickOutside(): void {
        this.definitionService.onClickOutside();
    }
}
