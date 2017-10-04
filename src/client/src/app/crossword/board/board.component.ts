import { Component, OnInit } from '@angular/core';
import { CrosswordGridService } from './crossword-grid.service';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
    providers: [CrosswordGridService]
})
export class BoardComponent implements OnInit {
    public crosswordGrid: string[][];

    constructor(private crosswordGridService: CrosswordGridService) { }

    public ngOnInit(): void {
        this.crosswordGrid = this.crosswordGridService.getGrid();
        console.log(this.crosswordGrid)
    }
}
