import { Injectable } from '@angular/core';

import { GridWord } from '../../common/crossword/grid-word';
import { Direction } from '../../common/crossword/crossword-enums';
import { ARRAY_GRIDWORD, ARRAY_GRIDWORD_H, ARRAY_GRIDWORD_V } from '../mocks/grid-mock';
import { CrosswordGameService } from '../crossword-game.service';

@Injectable()
export class CrosswordGridService {

    public grid: GridWord[];
    public horizontalGridWords: Map<number, GridWord>;
    public verticalGridWords: Map<number, GridWord>;
    private viewableGrid: string[][];

    constructor() {
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
}
