import { Component, OnInit, Input, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { CrosswordGridService } from './crossword-grid.service';
import { Direction } from '../grid-word';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
    providers: [CrosswordGridService]
})

export class BoardComponent implements OnInit {
	public crosswordGrid: string[][];

    public wordBuffer: string = '';

    @Input('indexOfDefinition') indexOfDefinition: number;

    @ViewChild('inputBuffer') inputBuffer: ElementRef;
    public onSelect(): void {
        this.inputBuffer.nativeElement.focus();
        this.inputBuffer.nativeElement.value = '';
    }

    constructor(private crosswordGridService: CrosswordGridService) { }

    public ngOnInit(): void {
        this.crosswordGrid = this.crosswordGridService.getGrid();

    }
}
