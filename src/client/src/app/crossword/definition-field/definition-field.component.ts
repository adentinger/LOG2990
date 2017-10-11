import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Definition } from './class/definition';
import { DefinitionsService } from './definitions.service';

@Component({
    selector: 'app-definition-field',
    templateUrl: './definition-field.component.html',
    styleUrls: ['./definition-field.component.css']
})
export class DefinitionFieldComponent implements OnInit {

    @ViewChild('inputBuffer') inputBuffer: ElementRef;

    @Output() selectedDefinition: EventEmitter<number> = new EventEmitter<number>();
    public definitions: Definition[] = [];

    constructor(private definitionService: DefinitionsService) {
        this.selectedDefinition = definitionService._selectedDefinition;
    }

    public ngOnInit(): void {
        this.definitions = this.definitionService.getDefinitions();
    }

    public get selectedDefinitionId() {
        return this.definitionService._selectedDefinitionId;
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
