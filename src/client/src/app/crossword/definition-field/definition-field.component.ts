import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input, } from '@angular/core';
import { Definition } from '../../common/crossword/definition';
import { DefinitionsService } from './definitions.service';

@Component({
    selector: 'app-definition-field',
    templateUrl: './definition-field.component.html',
    styleUrls: ['./definition-field.component.css']
})
export class DefinitionFieldComponent implements OnInit {

    @ViewChild('inputBuffer') public inputBuffer: ElementRef;

    @Input() public cheatMode: boolean;

    @Output() public selectedDefinition: EventEmitter<number> = new EventEmitter<number>();

    public definitions: Definition[] = [];
    public words: string[] = [];

    constructor(private definitionService: DefinitionsService) {
        this.selectedDefinition = definitionService.internalSelectedDefinition;
    }

    public ngOnInit(): void {
        this.definitions = this.definitionService.getDefinitions();
        this.words = this.definitionService.getWords();
    }

    public get selectedDefinitionId() {
        return this.definitionService.internalSelectedDefinitionId;
    }

    public set selectedDefinitionId(selectedDefinitionId) {
        this.definitionService.selectedDefinitionId = selectedDefinitionId;
    }

    public onSelect(index: number, event): void {
        this.definitionService.onSelect(index, event);
    }

    public onClickOutside(): void {
        this.definitionService.onClickOutside();
    }
}
