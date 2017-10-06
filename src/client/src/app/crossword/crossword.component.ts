import { Component, OnInit } from '@angular/core';
import { SimpleTimer } from 'ng2-simple-timer';
import { DefinitionsService } from './definition-field/definitions.service';

@Component({
    selector: 'app-crossword',
    templateUrl: './crossword.component.html',
    providers: [SimpleTimer,
                DefinitionsService]
})

export class CrosswordComponent implements OnInit {

    public gameIsBeingConfigured = true;
    public selectedDefinition: number;

    constructor() { }

    public ngOnInit(): void {
    }

    public onSelectedDefinitionChange(event) {
        this.selectedDefinition = event;
    }
}
