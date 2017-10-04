import { Component, OnInit } from '@angular/core';
import { Definition } from './class/definition';
import { DefinitionsService } from './definitions.service';

@Component({
    selector: 'app-definition-field',
    templateUrl: './definition-field.component.html',
    styleUrls: ['./definition-field.component.css'],
    providers: [DefinitionsService]
})
export class DefinitionFieldComponent implements OnInit {

    public definitions: Definition[] = [];
    public selectedDefinition: Definition = null;

    constructor(private definitionService: DefinitionsService) { }

    public ngOnInit(): void {
        this.definitions = this.definitionService.getDefinitions();
    }

    public onSelect(index: number): void {
        this.definitionService.crosswordGameService.selectedWord = index;
        this.selectedDefinition = this.definitions[index];
    }
    public onClickOutside(): void {
        this.selectedDefinition = null;
        this.definitionService.crosswordGameService.selectedWord = -1;
    }
}
