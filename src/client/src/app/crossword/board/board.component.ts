import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CrosswordGridService } from './crossword-grid.service';
import { GridWord } from '../../common/crossword/grid-word';
import { Direction } from '../../common/crossword/crossword-enums';
import { CrosswordGameService } from '../crossword-game.service';
import { DefinitionsService } from '../definition-field/definitions.service';
import { DefinitionFieldComponent } from '../definition-field/definition-field.component';
import { PacketManagerClient } from '../../packet-manager-client';
import { WordTryPacket } from '../../common/crossword/packets/word-try.packet';
import '../../common/crossword/packets/word-try.parser';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss']
})

export class BoardComponent implements OnInit {
    public indexOfDefinition: number;
    @ViewChild('inputBuffer') public inputBuffer: ElementRef;

    public onSelect(indexDefinition: number): void {
        this.indexOfDefinition = indexDefinition;
        if (this.indexOfDefinition !== null) {
            this.inputBuffer.nativeElement.focus();
            this.inputBuffer.nativeElement.value = '';
        }

        this.crosswordGridService.clearGridOfUselessLetters();
    }

    constructor(private crosswordGridService: CrosswordGridService, private crosswordGameService: CrosswordGameService,
        private definitionsService: DefinitionsService, private packetManager: PacketManagerClient) { }

    public ngOnInit(): void {
        this.crosswordGrid = this.crosswordGridService.getViewableGrid();
    }

    public onChange(inputValue) {
        const word = this.crosswordGridService.grid[this.indexOfDefinition];
        const input = this.crosswordGridService.stripSymbols(inputValue);
        this.inputBuffer.nativeElement.value = input;
        this.crosswordGridService.onInputChange(input, word);
    }

    public get crosswordGrid() {
        return this.crosswordGridService.crosswordGrid;
    }

    public set crosswordGrid(value: string[][]) {
        this.crosswordGridService.crosswordGrid = value;
    }
}
