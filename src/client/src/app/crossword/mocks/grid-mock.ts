//across
var wordA1: [number,number,string] = [0,0, "aaaaaa"];
var wordA2: [number,number,string] = [1,0, "aaaa"];
var wordA3: [number,number,string] = [2,0, "aaa"];
var wordA4: [number,number,string] = [3,3, "aaaaa"];
var wordA5: [number,number,string] = [4,3, "aaa"];
var wordA6: [number,number,string] = [5,3, "aaaaa"];
var wordA7: [number,number,string] = [6,3, "aaa"];
var wordA8: [number,number,string] = [7,6, "aaa"];
var wordA9: [number,number,string] = [8,5, "aaaa"];
var wordA10: [number,number,string] = [9,3, "aaaaaa"];
//vertical
var wordV1: [number,number,string] = [0,0, "aaaaaa"];
var wordV2: [number,number,string] = [0,1, "aaaa"];
var wordV3: [number,number,string] = [0,2, "aaa"];
var wordV4: [number,number,string] = [3,3, "aaaa"];
var wordV5: [number,number,string] = [3,4, "aaaa"];
var wordV6: [number,number,string] = [3,5, "aaaa"];
var wordV7: [number,number,string] = [7,6, "aaa"];
var wordV8: [number,number,string] = [7,7, "aaa"];
var wordV9: [number,number,string] = [7,8, "aaa"];
var wordV10: [number,number,string] = [2,9, "aaaaa"];

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

function fillAcross(tuple: [number, number, string]) { //(y,x,word)
    for (let i = 0; i < tuple[2].length; i++) {
        CROSSWORD[tuple[0]][i + tuple[1]] = tuple[2].charAt(i);
    }
}

function fillVertical(tuple: [number, number, string]) { //(y,x,word)
    for (let i = 0; i < tuple[2].length; i++) {
        CROSSWORD[i + tuple[0]][tuple[1]] = tuple[2].charAt(i);
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