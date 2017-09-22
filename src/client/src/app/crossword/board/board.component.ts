import { Component, OnInit } from '@angular/core';
import { CrosswordGridService } from './crossword-grid.service';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
    providers: [CrosswordGridService]
})
export class BoardComponent implements OnInit {
    public get crosswordGrid(): string[][] {
        return this.crosswordGridService.getGrid(); 
    }

    constructor(private crosswordGridService: CrosswordGridService) { }

    public ngOnInit(): void {
        this.crosswordGridService.fetchGrid();
    }
}
