//across

var word1: [number,number,string] = [0,0, "aaaaaa"];
var word2: [number,number,string] = [1,0, "aaaa"];
var word3: [number,number,string] = [2,0, "aaa"];
var word4: [number,number,string] = [3,3, "aaaaa"];
var word5: [number,number,string] = [4,3, "aaa"];
var word6: [number,number,string] = [5,3, "aaaaa"];
var word7: [number,number,string] = [6,3, "aaa"];
var word8: [number,number,string] = [7,6, "aaa"];
var word9: [number,number,string] = [8,5, "aaaa"];
var word10: [number,number,string] = [9,3, "aaaaaa"];
//vertical
var word1: [number,number,string] = [0,0, "aaaaaa"];
var word2: [number,number,string] = [0,1, "aaaa"];
var word3: [number,number,string] = [0,2, "aaa"];
var word4: [number,number,string] = [3,3, "aaaa"];
var word5: [number,number,string] = [3,4, "aaaa"];
var word6: [number,number,string] = [3,5, "aaaa"];
var word7: [number,number,string] = [7,6, "aaa"];
var word8: [number,number,string] = [7,7, "aaa"];
var word9: [number,number,string] = [7,8, "aaa"];
var word10: [number,number,string] = [2,9, "aaaaa"];

export var CROSSWORD: string[][];
fill();
fillAcross(word1);
fillAcross(word2);/*
fillAcross(word3);
fillAcross(word4);
fillAcross(word5);
fillAcross(word6);
fillAcross(word7);
fillAcross(word8);
fillAcross(word9);
fillAcross(word10);
fillVertical(word1);
fillVertical(word2);
fillVertical(word3);
fillVertical(word4);
fillVertical(word5);
fillVertical(word6);
fillVertical(word7);
fillVertical(word8);
fillVertical(word9);
fillVertical(word10);
*/
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