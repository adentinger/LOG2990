import { Component, OnInit } from '@angular/core';
import { SimpleTimer } from 'ng2-simple-timer';

@Component({
    selector: 'app-crossword',
    templateUrl: './crossword.component.html',
    providers: [SimpleTimer]
})

export class CrosswordComponent implements OnInit {

    public gameIsBeingConfigured = true;
    constructor() { }

    public ngOnInit(): void {
    }
}
