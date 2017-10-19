import { Injectable } from '@angular/core';

import { GridWord } from '../../common/crossword/grid-word';
import { Direction } from '../../common/crossword/crossword-enums';
import { ARRAY_GRIDWORD, ARRAY_GRIDWORD_H, ARRAY_GRIDWORD_V } from '../mocks/grid-mock';
import { CrosswordGameService } from '../crossword-game.service';
import { PacketManagerClient } from '../../packet-manager-client';
import { registerHandlers, PacketHandler, PacketEvent } from '../../common/index';
import { WordTryPacket } from '../../common/crossword/packets/word-try.packet';
import '../../common/crossword/packets/word-try.parser';
import { DefinitionsService } from '../definition-field/definitions.service';

@Injectable()
export class CrosswordGridService {
    public crosswordGrid: string[][];
    public wordIsFound = false;
    public grid: GridWord[];
    public horizontalGridWords: Map<number, GridWord>;
    public verticalGridWords: Map<number, GridWord>;
    private viewableGrid: string[][];

    constructor(private crosswordGameService: CrosswordGameService, private packetManager: PacketManagerClient,
        private definitionsService: DefinitionsService) {
        registerHandlers(this, packetManager);
        this.grid = ARRAY_GRIDWORD;
        this.horizontalGridWords = new Map(ARRAY_GRIDWORD_H.map((value: GridWord, index: number) => <[number, GridWord]>[index, value]));
        this.verticalGridWords = new Map(ARRAY_GRIDWORD_V.map((value: GridWord, index: number) => <[number, GridWord]>[index, value]));
        this.fill();
        this.fillAll();
    }

    public getViewableGrid(): string[][] {
        const CROSSWORD = this.viewableGrid;
        return CROSSWORD;
    }

    public fillAll() {
        this.fill();
        /*
        for (let i = 0; i < this.grid.length; i++) {
            this.fillAcrossAndVertical(this.grid[i]);
        }
        */
        for (let i = 0; i < this.horizontalGridWords.size; i++) {
            this.fillHorizontal(this.horizontalGridWords.get(i));
        }

        for (let i = 0; i < this.verticalGridWords.size; i++) {
            this.fillVertical(this.verticalGridWords.get(i));
        }
    }

    public fillHorizontal(gridWord: GridWord): void {
        for (let i = 0; i < gridWord.length; i++) {
            this.viewableGrid[gridWord.y][i + gridWord.x] = '';
        }
    }

    public fillVertical(gridWord: GridWord): void {
        for (let i = 0; i < gridWord.length; i++) {
            this.viewableGrid[i + gridWord.y][gridWord.x] = '';
        }
    }

    public fillAcrossAndVertical(gridWord: GridWord) { // (y,x,length,direction,owner,string)
        if (gridWord.direction === Direction.horizontal) {
            for (let i = 0; i < gridWord.length; i++) {
                this.viewableGrid[gridWord.y][i + gridWord.x] = '';
            }
        }
        else if (gridWord.direction === Direction.vertical) {
            for (let i = 0; i < gridWord.length; i++) {
                this.viewableGrid[i + gridWord.y][gridWord.x] = '';
            }
        }
    }

    public fill() {
        this.viewableGrid = [
            ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0']
        ];
    }

    public stripSymbols(input) {
        return input.replace(/[^a-zA-Z]/g, '');
    }

    public onInputChange(input: string, word: GridWord) {
        if (this.crosswordGameService.aDefinitionIsSelected) {
            if (input.length < word.length) {
                this.inputLettersOnGrid(word, input);
            }
            else if (input.length === word.length) {
                this.inputLettersOnGrid(word, input);
                this.sendWordToServer(input, word);


                this.definitionsService.internalSelectedDefinitionId = -1;
                this.crosswordGameService.aDefinitionIsSelected = false;
            }
        }
    }

    public inputLettersOnGrid(word: GridWord, input: string) {
        for (let i = 0; i < word.length; i++) {
            if (word.direction === Direction.horizontal) {
                if (i < input.length) {
                    this.crosswordGrid[word.y][word.x + i] = input[i];
                }
                else {
                    this.crosswordGrid[word.y][word.x + i] = '';
                }
            }
            else if (word.direction === Direction.vertical) {
                if (i < input.length) {
                    this.crosswordGrid[word.y + i][word.x] = input[i];
                }
                else {
                    this.crosswordGrid[word.y + i][word.x] = '';
                }
            }
        }
    }

    public clearGridOfUselessLetters(): void {
        const words = this.grid;
        for (let i = 0; i < words.length; i++) {
            if (words[i].string === '') {
                this.inputLettersOnGrid(words[i], '');
            }
        }
    }

    // TODO Verify the word entered if it matches the word on the server
    public sendWordToServer(input: string, word: GridWord) {
        const newGridWord = Object.assign(new GridWord, word);
        newGridWord.string = input;

        this.packetManager.sendPacket(WordTryPacket, new WordTryPacket(newGridWord));
    }

    @PacketHandler(WordTryPacket)
    public isTheGoodAnswer(event: PacketEvent<WordTryPacket>) {
        if (event.value.wordTry.string !== '') {
            this.wordIsFound = true;
        }
        else {
            this.wordIsFound = false;
        }
    }
}
