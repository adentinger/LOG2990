import { Injectable, OnInit } from '@angular/core';

import { GridWord, Direction, Owner } from '../grid-word';
import { ARRAY_GRIDWORD } from '../mocks/grid-mock';
import { CrosswordGameService } from '../crossword-game.service';

@Injectable()
export class CrosswordGridService {

    public grid: GridWord[];
    private viewableGrid: string[][];


    constructor(public crosswordGameService: CrosswordGameService) {
        this.grid = ARRAY_GRIDWORD;
        this.fill();
        this.fillAll();
    }

    public getGrid(): string[][] {
        const CROSSWORD = this.viewableGrid;
        return CROSSWORD;
    }

    public fillAll() {
        this.fill();
        for (let i = 0; i < this.grid.length; i++) {
            this.fillAcrossAndVertical(this.grid[i]);
        }
    }

    public fillAcrossAndVertical(gridWord: GridWord) { // (y,x,length,direction,owner,string)
        if (gridWord.direction === Direction.across) {
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
