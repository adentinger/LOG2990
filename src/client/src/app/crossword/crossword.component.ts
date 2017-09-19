import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-crossword',
    templateUrl: './crossword.component.html'
})

export class CrosswordComponent implements OnInit {

    public gameIsBeingConfigured = true;
    constructor() { }

    public ngOnInit(): void {
    }
}
