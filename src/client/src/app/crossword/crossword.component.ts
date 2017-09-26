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
    constructor() { }

    public ngOnInit(): void {
    }
}
