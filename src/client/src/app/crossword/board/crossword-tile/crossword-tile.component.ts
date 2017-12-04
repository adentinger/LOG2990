import { Component, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { WhoIsSelecting } from './highlight-grid';
import { Grid } from '../grid';

@Component({
    selector: 'app-tile',
    templateUrl: './crossword-tile.component.html',
    styleUrls: ['./crossword-tile.component.scss'],
})
export class CrosswordTileComponent {

    @Input() public readonly tileRow: number;
    @Input() public readonly tileColumn: number;

    @Input() public highlighted: WhoIsSelecting;
    @Input() public filled: WhoIsSelecting;

    @Input()
    public set tileChar(value: string) {
        this.tileValue = value !== Grid.BLACK_TILE ? value : '';
    }

    public get tileChar(): string {
        return this.tileValue;
    }

    public get isBlackTile(): boolean {
        return this.tileValue === '';
    }

    @ViewChild('caseInput') public caseInput: ElementRef;

    public readonly WhoIsSelecting = WhoIsSelecting;
    public tileValue: string;

}
