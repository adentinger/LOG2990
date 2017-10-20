import { CharConstraint } from '../../../common/index';
import { Grid } from './grid';
import { WordPosition } from './word-position';
import { Word } from './word';

type AxisGetter = (position: WordPosition) => number;
type PositionModifier = (position: WordPosition) => void;

export class WordConstraintChecker {

    private static INSTANCE = new WordConstraintChecker();

    private constructor() {}

    public static getInstance(): WordConstraintChecker {
        return WordConstraintChecker.INSTANCE;
    }

    public getAcrossWordConstraint(grid: Grid, position: WordPosition, minLength: number): CharConstraint[] {
        return this.getWordConstraint(
            grid.vertical,
            grid.across,
            position,
            minLength,
            (wordPosition) => wordPosition.column,
            (wordPosition) => wordPosition.row,
            (wordPosition) => { ++wordPosition.column; },
            (wordPosition) => { --wordPosition.column; }
        );
    }

    public getVerticalWordConstraint(grid: Grid, position: WordPosition, minLength: number): CharConstraint[] {
        return this.getWordConstraint(
            grid.across,
            grid.vertical,
            position,
            minLength,
            (wordPosition) => wordPosition.row,
            (wordPosition) => wordPosition.column,
            (wordPosition) => { ++wordPosition.row; },
            (wordPosition) => { --wordPosition.row; }
        );
    }

    private getWordConstraint(transversalWords: Word[],
                              parallelWords: Word[],
                              position: WordPosition,
                              minLength: number,
                              iteratedAxisGetter: AxisGetter,
                              constantAxisGetter: AxisGetter,
                              incrementIteratedAxis: PositionModifier,
                              decrementIteratedAxis: PositionModifier): CharConstraint[] {
        const CONSTRAINTS: CharConstraint[] = [];

        const CURRENT_POSITION = new WordPosition(position.row,
                                                  position.column);
        // this.changePositionToConstraintBeginning(
        //     CURRENT_POSITION,
        //     transversalWords,
        //     iteratedAxisGetter,
        //     constantAxisGetter,
        //     incrementIteratedAxis,
        //     decrementIteratedAxis
        // );

        let characterPosition = 0;
        let shouldTryToFindNextChar = true;
        for (characterPosition = 0; characterPosition < minLength; ++characterPosition) {

            const WORD_THAT_CONTAINS_POSITION =
                this.findWordThatContainsPosition(
                    transversalWords,
                    CURRENT_POSITION,
                    constantAxisGetter,
                    iteratedAxisGetter
                );

            const CHAR_FOUND = (WORD_THAT_CONTAINS_POSITION !== undefined);

            if (CHAR_FOUND) {
                const CHARACTER =
                    this.charOfWordAtPosition(
                        WORD_THAT_CONTAINS_POSITION,
                        CURRENT_POSITION,
                        constantAxisGetter
                    );
                const CHAR_CONSTRAINT: CharConstraint = {
                    char: CHARACTER,
                    position: characterPosition
                };
                CONSTRAINTS.push(CHAR_CONSTRAINT);
            }

            shouldTryToFindNextChar = CHAR_FOUND;
            incrementIteratedAxis(CURRENT_POSITION);
        }
        return CONSTRAINTS;
    }

    // private changePositionToConstraintBeginning(position: WordPosition,
    //                                             words: Word[],
    //                                             iteratedAxisGetter: AxisGetter,
    //                                             constantAxisGetter: AxisGetter,
    //                                             incrementIteratedAxis: PositionModifier,
    //                                             decrementIteratedAxis: PositionModifier): void {
    //     const DUMMY_INITIAL_CHAR = '8';
    //     let charAtCurrentPosition = DUMMY_INITIAL_CHAR;
    //     while (iteratedAxisGetter(position) >= 0 &&
    //            charAtCurrentPosition.length !== 0) {
    //         decrementIteratedAxis(position);
    //         const WORD_THAT_CONTAINS_POSITION =
    //             this.findWordThatContainsPosition(
    //                 words,
    //                 position,
    //                 constantAxisGetter,
    //                 iteratedAxisGetter
    //             );
    //         if (WORD_THAT_CONTAINS_POSITION !== undefined) {
    //             charAtCurrentPosition =
    //                 this.charOfWordAtPosition(
    //                     WORD_THAT_CONTAINS_POSITION,
    //                     position,
    //                     constantAxisGetter
    //                 );
    //         }
    //         else {
    //             charAtCurrentPosition = '';
    //         }
    //     }
    //     incrementIteratedAxis(position);
    // }

    private findWordThatContainsPosition(words: Word[],
                                         position: WordPosition,
                                         constantAxisGetter: AxisGetter,
                                         iteratedAxisGetter: AxisGetter): Word {
        return words.find((word) => {
            const MIN_CONSTANT_AXIS = constantAxisGetter(word.position);
            const MAX_CONSTANT_AXIS = MIN_CONSTANT_AXIS + word.value.length - 1;
            const ITERATED_AXIS = iteratedAxisGetter(word.position);
            const WORD_CONTAINS_POSITION =
                ITERATED_AXIS === iteratedAxisGetter(position) &&
                constantAxisGetter(position) >= MIN_CONSTANT_AXIS &&
                constantAxisGetter(position) <= MAX_CONSTANT_AXIS;
            return WORD_CONTAINS_POSITION;
        });
    }

    private charOfWordAtPosition(word: Word,
                                 position: WordPosition,
                                 constantAxisGetter: AxisGetter): string {
        return word.value
            .charAt(constantAxisGetter(position) -
                    constantAxisGetter(word.position));
    }

}
