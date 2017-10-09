import { GridFiller } from './grid-filler';
import { lexicon } from './englishWords';
import { getRandomIndex } from './lexique';
import { Word } from './word';
import { Grid } from './grid-generator';

enum row {first, second, third, fourth}

export class GridFillerSecondSection extends GridFiller {

    public firstAcrossWordLenght = [3, 5];
    public secondAcrossWordLenght = [3, 3];
    public thirdWordAcrossLenght = [3, 5];
    public fourthWordAcrossLenght = 3;
    public firstWordLenght: [number, number] = [3, 4];
    public secondWordLenght: [number, number] = [3, 4];
    public thirdWordLenght: [number, number] = [3, 3];
    public untilWhichRow = 3;

    public temporaryGridForAcross: Word[] = [];
    public temporaryGridForVertical: Word[] = [];

    constructor(grid: Grid) {
        super(grid, [3, 4], [3, 4], [3, 4], 4);
        this.initialisation(grid);
    }


    public returnARandomWordFromSuggestions (beginningOfTheWordAcross: string, rowNumber: number): string {
        let returnedWord;
        const theWords: string[] = [];
        for (let i = 0; i < lexicon.length; i++) {  // if the beginning of 2 words matches
            if (lexicon[i].substring(0, beginningOfTheWordAcross.length) === beginningOfTheWordAcross) {
                if (((lexicon[i].substring(0, beginningOfTheWordAcross.length).length)) > 0) {
                    if (rowNumber === row.first) {
                        if (lexicon[i].length <= this.firstAcrossWordLenght[1] &&
                            lexicon[i].length >= this.firstAcrossWordLenght[0]) { // At (0,0) ---->
                            theWords.push(lexicon[i]);
                        }
                    }else if (rowNumber === row.second) {
                        if (lexicon[i].length <= this.secondAcrossWordLenght[1] &&
                            lexicon[i].length >= this.secondAcrossWordLenght[0]) { // At (1,0) ---->
                            theWords.push(lexicon[i]);
                        }
                    }else if (rowNumber === row.third) {
                        if (lexicon[i].length <= this.thirdWordAcrossLenght[1] &&
                            lexicon[i].length >= this.thirdWordAcrossLenght[0]) { // At (1,0) ---->
                            theWords.push(lexicon[i]);
                        }
                    }
                }else if (rowNumber === row.fourth) {
                    if (lexicon[i].length === this.fourthWordAcrossLenght) {  // At (2,0) ---->
                        theWords.push(lexicon[i]);
                    }
                }
            }
        }

        returnedWord = theWords[getRandomIndex(0, theWords.length - 1)];

        if (!returnedWord) {
            returnedWord = 'nothing found';
        }

        return returnedWord;
    }
}