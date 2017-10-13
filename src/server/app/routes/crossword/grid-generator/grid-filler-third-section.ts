import { GridFiller, row,  } from './grid-filler';
import { lexicon } from './englishWords';
import { getRandomIndex, reverseString, getWordOfDesiredLength } from './lexique';
import { GridGenerator } from './grid-generator';

export class GridFillerThirdSection extends GridFiller {

    constructor(grid: GridGenerator, isCommon: boolean) {
        super(grid, isCommon);
        this.firstWordLenght = [3, 3];
        this.secondWordLenght = [3, 3];
        this.thirdWordLenght = [3, 3];
        this.untilWhichRow = 3;
        this.acrossWordLenght = [[3, 3], [3, 4], [3, 9]];
        this.initialisation(grid);
    }

    public returnARandomWordFromSuggestions (beginningOfTheWordAcross: string, rowNumber: number): string {
        beginningOfTheWordAcross = reverseString(beginningOfTheWordAcross);
        let returnedWord;
        const theWords: string[] = [];
        for (let i = 0; i < lexicon.length; i++) { // if the end of 2 words matches
            if (lexicon[i].substring((lexicon[i].length) - beginningOfTheWordAcross.length) === beginningOfTheWordAcross) {
                if (((lexicon[i].substring((lexicon[i].length) - beginningOfTheWordAcross.length).length)) > 0) {
                    super.getSuggestion(theWords, rowNumber, i);
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