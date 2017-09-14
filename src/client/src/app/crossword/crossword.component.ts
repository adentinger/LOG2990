import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-crossword',
    templateUrl: './crossword.component.html'
})

export class CrosswordComponent implements OnInit {

    gameIsBeingConfigured: boolean = true;
    constructor ( ) {}

    public ngOnInit(): void {
    }
}
