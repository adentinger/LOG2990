import { Component, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { WhoIsSelecting } from './highlight-grid';

@Component({
    selector: 'app-tile',
    templateUrl: './crossword-tile.component.html',
    styleUrls: ['./crossword-tile.component.scss'],
})
export class CrosswordTileComponent {

    public tileValue: string;
    @Input() public readonly tileRow: number;
    @Input() public readonly tileColumn: number;

    @Input() public highlighted: WhoIsSelecting;
    public WhoIsSelecting = WhoIsSelecting;

    @Input() get tileChar() {
        return this.tileValue;
    }
    @Output() public tileValueChange: EventEmitter<string> = new EventEmitter<string>();
    set tileChar(value) {
        this.tileValue = value;
        this.tileValueChange.emit(this.tileValue);
    }

    @ViewChild('caseInput') public caseInput: ElementRef;

}
