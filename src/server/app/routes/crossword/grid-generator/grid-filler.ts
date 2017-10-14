import { Word } from './word';
import { WordCaller } from './WordCaller';
import { GridGenerator } from './grid-generator';
import { lexicon } from './englishWords';


export const WORD_SEARCH_MAX_ATTEMPT = 200;
export enum column { first, second, third }
export enum row { first, second, third }

export abstract class GridFiller {

    protected acrossWordLenght: [number, number][];

    protected firstWordLenght: [number, number];
    protected secondWordLenght: [number, number];
    protected thirdWordLenght: [number, number];
    protected untilWhichRow: number;
    protected isCommon: boolean;
    protected wordCaller: WordCaller;


    public temporaryGridForAcross: Word[] = [];
    public temporaryGridForVertical: Word[] = [];

    constructor(grid: GridGenerator, isCommon: boolean) {
        this.isCommon = isCommon;
        this.wordCaller = new WordCaller();
     }

    public pushOnTheTemporaryGridAcrossWordsSuggestions(wordsSuggestions: string[]) {
        for (let i = 0; i < wordsSuggestions.length; i++) {
            this.temporaryGridForAcross.push(new Word(wordsSuggestions[i]));
        }
    }

    public initialisation(grid: GridGenerator) {
        const word = new Word('');
        this.wordCaller.getWordsSynchronous(this.firstWordLenght[0],
            this.firstWordLenght[1], this.isCommon).then((words: string[]) => {
                word.value = words[Math.round(Math.random() * words.length)];
            });

        this.temporaryGridForVertical.push(word);
        this.findSecondWord(word, grid);
    }

    public findSecondWord(word: Word, grid: GridGenerator) {
        let firstWordsSuggestions: string[] = [];
        let maxAttempt = WORD_SEARCH_MAX_ATTEMPT;
        while (maxAttempt !== 0) {
            this.wordCaller.getWordsSynchronous(this.secondWordLenght[0],
                this.secondWordLenght[1], this.isCommon).then((words: string[]) => {
                    word.value = words[Math.round(Math.random() * words.length)];
                });
            //word = this.wordCaller.getWordOfDesiredLength(this.secondWordLenght[0], this.secondWordLenght[1], grid);
            this.temporaryGridForVertical.push(word);
            firstWordsSuggestions = this.returnArrayOfWordsThatFitsAcross(column.second);

            if (this.suggestionsContainsNothing(firstWordsSuggestions)) {
                this.temporaryGridForVertical.pop();
                maxAttempt--;
            } else {
                break;
            }
        }
        if (maxAttempt === 0) {
            this.temporaryGridForVertical.pop();
            this.initialisation(grid);
        } else {
            this.findThirdWord(word, firstWordsSuggestions, grid);
        }
    }

    public findThirdWord(word: Word, wordsSuggestions: string[], grid: GridGenerator) {
        wordsSuggestions = [];
        let maxAttempt = WORD_SEARCH_MAX_ATTEMPT;
        while (maxAttempt !== 0) {
            //word = this.wordCaller.getWordOfDesiredLength(this.thirdWordLenght[0], this.thirdWordLenght[1], grid);
            this.wordCaller.getWordsSynchronous(this.thirdWordLenght[0],
                this.thirdWordLenght[1], this.isCommon).then((words: string[]) => {
                    word.value = words[Math.round(Math.random() * words.length)];
                });
            this.temporaryGridForVertical.push(word);
            wordsSuggestions = this.returnArrayOfWordsThatFitsAcross(column.third);

            if (this.suggestionsContainsNothing(wordsSuggestions)) {
                this.temporaryGridForVertical.pop();
                maxAttempt--;
            } else {
                break;
            }
        }
        if (maxAttempt === 0) {
            this.temporaryGridForVertical.pop();
            this.findSecondWord(word, grid);
        } else {
            this.pushOnTheTemporaryGridAcrossWordsSuggestions(wordsSuggestions);
        }
    }

    public returnArrayOfWordsThatFitsAcross(onColumnNow: number) {
        const firstLettersWordsArray: string[] = [];
        let beginningOfTheWordOnAcross: string[] = [];

        for (let row = 0; row < this.untilWhichRow; row++) { // for the first rows of the grid
            for (let column = 0; column <= onColumnNow; column++) {
                beginningOfTheWordOnAcross.push(this.temporaryGridForVertical[column].value[row]);
            }
            const beginningOfTheWordOnAcrossString: string = beginningOfTheWordOnAcross.join('');
            beginningOfTheWordOnAcross = [];
            let returnedWord;

            returnedWord = this.returnARandomWordFromSuggestions(beginningOfTheWordOnAcrossString, row);
            firstLettersWordsArray.push(returnedWord);
        }

        return firstLettersWordsArray;
    }

    public suggestionsContainsNothing(arrayOfSuggestions: string[]) {
        for (let i = 0; i < arrayOfSuggestions.length; i++) {
            if (arrayOfSuggestions[i] === 'nothing found') {
                return true;
            }
        }
        return false;
    }

    protected getSuggestion(theWords: string[], rowNumber: number, wordIndex: number) {
        if (lexicon[wordIndex].length <= this.acrossWordLenght[rowNumber][1] &&
            lexicon[wordIndex].length >= this.acrossWordLenght[rowNumber][0]) {
            theWords.push(lexicon[wordIndex]);
        }
    }

    public returnARandomWordFromSuggestions(beginningOfTheWordAcross: string, rowNumber: number): string {
        let returnedWord;
        const theWords: string[] = [];
        for (let i = 0; i < lexicon.length; i++) {  // if the beginning of 2 words matches
            if (lexicon[i].substring(0, beginningOfTheWordAcross.length) === beginningOfTheWordAcross) {
                if (beginningOfTheWordAcross.length > 0) {
                    this.getSuggestion(theWords, rowNumber, i);
                }
            }
        }

        returnedWord = theWords[this.wordCaller.getRandomIndex(0, theWords.length - 1)];

        if (!returnedWord) {
            returnedWord = 'nothing found';
        }
        return returnedWord;
    }
}

