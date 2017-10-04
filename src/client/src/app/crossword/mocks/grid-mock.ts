import { GridWord, Direction, Owner } from "../grid-word";


export const ARRAYGRIDWORD: GridWord[] = [
    {'y': 0,'x': 0,'length': 7,'direction': Direction.across,'owner': Owner.none,'string': ""},
    {'y': 1,'x': 0,'length': 4,'direction': Direction.across,'owner': Owner.none,'string': ""},
    {'y': 2,'x': 0,'length': 3,'direction': Direction.across,'owner': Owner.none,'string': ""},
    {'y': 3,'x': 3,'length': 5,'direction': Direction.across,'owner': Owner.none,'string': ""},
    {'y': 4,'x': 3,'length': 3,'direction': Direction.across,'owner': Owner.none,'string': ""},
    {'y': 5,'x': 3,'length': 5,'direction': Direction.across,'owner': Owner.none,'string': ""},
    {'y': 6,'x': 3,'length': 3,'direction': Direction.across,'owner': Owner.none,'string': ""},
    {'y': 7,'x': 6,'length': 3,'direction': Direction.across,'owner': Owner.none,'string': ""},
    {'y': 8,'x': 5,'length': 4,'direction': Direction.across,'owner': Owner.none,'string': ""},
    {'y': 9,'x': 3,'length': 6,'direction': Direction.across,'owner': Owner.none,'string': ""},

    {'y': 0,'x': 0,'length': 6,'direction': Direction.vertical,'owner': Owner.none,'string': ""},
    {'y': 0,'x': 1,'length': 4,'direction': Direction.vertical,'owner': Owner.none,'string': ""},
    {'y': 0,'x': 2,'length': 3,'direction': Direction.vertical,'owner': Owner.none,'string': ""},
    {'y': 3,'x': 3,'length': 4,'direction': Direction.vertical,'owner': Owner.none,'string': ""},
    {'y': 3,'x': 4,'length': 4,'direction': Direction.vertical,'owner': Owner.none,'string': ""},
    {'y': 3,'x': 5,'length': 4,'direction': Direction.vertical,'owner': Owner.none,'string': ""},
    {'y': 7,'x': 6,'length': 3,'direction': Direction.vertical,'owner': Owner.none,'string': ""},
    {'y': 7,'x': 7,'length': 3,'direction': Direction.vertical,'owner': Owner.none,'string': ""},
    {'y': 7,'x': 8,'length': 3,'direction': Direction.vertical,'owner': Owner.none,'string': ""},
    {'y': 2,'x': 9,'length': 5,'direction': Direction.vertical,'owner': Owner.none,'string': ""}
]

/*
//across
var wordA1: [number,number,number] = [0,0,7];
var wordA2: [number,number,number] = [1,0,4];
var wordA3: [number,number,number] = [2,0,3];
var wordA4: [number,number,number] = [3,3,5];
var wordA5: [number,number,number] = [4,3,3];
var wordA6: [number,number,number] = [5,3,5];
var wordA7: [number,number,number] = [6,3,3];
var wordA8: [number,number,number] = [7,6,3];
var wordA9: [number,number,number] = [8,5,4];
var wordA10: [number,number,number] = [9,3,6];
//vertical
var wordV1: [number,number,number] = [0,0,6];
var wordV2: [number,number,number] = [0,1,4];
var wordV3: [number,number,number] = [0,2,3];
var wordV4: [number,number,number] = [3,3,4];
var wordV5: [number,number,number] = [3,4,4];
var wordV6: [number,number,number] = [3,5,4];
var wordV7: [number,number,number] = [7,6,3];
var wordV8: [number,number,number] = [7,7,3];
var wordV9: [number,number,number] = [7,8,3];
var wordV10: [number,number,number] = [2,9,5];*/

/*
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

/*
export const CROSSWORD: string[][] = [
    ['0', '0', '0', 'n', 'a', 'r', 'r', 'o', 'w', 's'],
    ['h', 'a', 'd', 'i', 'r', '0', '0', 'g', '0', 'i'],
    ['e', '0', 'e', 'b', 'b', '0', '0', 'd', '0', 'c'],
    ['r', '0', 'n', '0', 'o', '0', '0', 'o', 'a', 'k'],
    ['a', 'b', 'i', 'r', 'r', 'i', 't', 'a', 't', 'e'],
    ['l', 'i', 'a', 'r', '0', 'a', '0', 'd', 'e', 'n'],
    ['L', 'a', 'b', '0', '0', 'm', '0', '0', '0', '0'],
    ['0', 's', 'l', 'y', '0', 'b', 'i', 'a', 'l', 'y'],
    ['f', 'e', 'e', '0', '0', '0', 'c', '0', 'e', '0'],
    ['0', 'd', '0', 'i', 'l', 'l', 'e', 'g', 'a', 'l']
];
*/