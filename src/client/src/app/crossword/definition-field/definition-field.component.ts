import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, } from '@angular/core';
import { Definition } from '../../common/crossword/definition';
import { DefinitionsService } from './definitions.service';

@Component({
    selector: 'app-definition-field',
    templateUrl: './definition-field.component.html',
    styleUrls: ['./definition-field.component.css']
})
export class DefinitionFieldComponent implements OnInit {

    @ViewChild('inputBuffer') public inputBuffer: ElementRef;
    @Output() public selectedDefinition: EventEmitter<number> = new EventEmitter<number>();

    // public definitions: Definition[] = [];

    public words: string[] = [];

    constructor(private definitionService: DefinitionsService) {
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

    public getCheatModeStateText(): string {
        return this.definitionService.getCheatModeStateText();
    }

    public getCheatModeState(): boolean {
        return this.definitionService.getCheatModeState();
    }

    public setCheatModeOnOff(): void {
        this.definitionService.setCheatModeOnOff();
    }

    public getTimerState(): boolean {
        return this.definitionService.getTimerState();
    }

    public getTimerStateText(): string {
        return this.definitionService.getTimerStateText();
    }

    public setTimerOnOff(): void {
        return this.definitionService.setTimerOnOff();
    }

    // not done
    public changeTimerValue(seconds: string): void {
        this.definitionService.changeTimerValue(seconds);
    }
}
