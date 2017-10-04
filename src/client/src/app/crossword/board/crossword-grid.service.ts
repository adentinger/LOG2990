import { Injectable, OnInit } from '@angular/core';

import { GridWord } from '../grid-word';
import { ARRAY_GRIDWORD } from '../mocks/grid-mock';

@Injectable()
export class CrosswordGridService implements OnInit{

    private grid: GridWord[];

    

    public getGrid(): string[][] {
        return CROSSWORD;
    }

    public ngOnInit(): void {
        this.grid = ARRAY_GRIDWORD;
        
    }
}

export var CROSSWORD: string[][];
fill();
fillAcross(wordA1);
fillAcross(wordA2);
fillAcross(wordA3);
fillAcross(wordA4);
fillAcross(wordA5);
fillAcross(wordA6);
fillAcross(wordA7);
fillAcross(wordA8);
fillAcross(wordA9);
fillAcross(wordA10);
fillVertical(wordV1);
fillVertical(wordV2);
fillVertical(wordV3);
fillVertical(wordV4);
fillVertical(wordV5);
fillVertical(wordV6);
fillVertical(wordV7);
fillVertical(wordV8);
fillVertical(wordV9);
fillVertical(wordV10);

function fill() {
    CROSSWORD = [
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
    ]
}

function fillAcross(tuple: [number, number, number]) { //(y,x,word)
    for (let i = 0; i < tuple[2]; i++) {
        CROSSWORD[tuple[0]][i + tuple[1]] = '1';
    }
}

function fillVertical(tuple: [number, number, number]) { //(y,x,word)
    for (let i = 0; i < tuple[2]; i++) {
        CROSSWORD[i + tuple[0]][tuple[1]] = '1';
    }
}