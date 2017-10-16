import { Component, OnInit, Output, EventEmitter, } from '@angular/core';
import { Definition } from '../../common/crossword/definition';
import { DefinitionsService } from './definitions.service';

@Component({
    selector: 'app-definition-field',
    templateUrl: './definition-field.component.html',
    styleUrls: ['./definition-field.component.css'],
    providers: [DefinitionsService]
})
export class DefinitionFieldComponent implements OnInit {

    @Output() public selectedDefinition: EventEmitter<number> = new EventEmitter<number>();
    public selectedDefinitionId: number = -1;
    public definitions: Definition[] = [];

    constructor(private definitionService: DefinitionsService) { }

    public ngOnInit(): void {
        this.definitions = this.definitionService.getDefinitions();
    }

    public onSelect(index: number, event): void {
        this.selectedDefinitionId = index;
        this.selectedDefinition.emit(index);
        this.definitionService.crosswordGameService.selectedWordIndex = index;

        this.definitionService.crosswordGameService.aDefinitionIsSelected = true;
        // change le focus vers le buffer
    }

    public onClickOutside(): void {
        this.selectedDefinitionId = -1;
        this.selectedDefinition.emit(null);
        this.definitionService.crosswordGameService.selectedWordIndex = 0;

        this.definitionService.crosswordGameService.aDefinitionIsSelected = false;
    }
}
