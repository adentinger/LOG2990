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

    public getAcrossWordConstraint(grid: Grid, position: WordPosition): CharConstraint[] {
        return this.getWordConstraint(
            grid.vertical,
            position,
            (wordPosition) => wordPosition.column,
            (wordPosition) => wordPosition.row,
            (wordPosition) => { ++wordPosition.column; },
            (wordPosition) => { --wordPosition.column; });
    }

    public getVerticalWordConstraint(grid: Grid, position: WordPosition): CharConstraint[] {
        return this.getWordConstraint(
            grid.across,
            position,
            (wordPosition) => wordPosition.row,
            (wordPosition) => wordPosition.column,
            (wordPosition) => { ++wordPosition.row; },
            (wordPosition) => { --wordPosition.row; });
    }

    private getWordConstraint(words: Word[],
                              position: WordPosition,
                              iteratedAxisGetter: AxisGetter,
                              constantAxisGetter: AxisGetter,
                              incrementIteratedAxis: PositionModifier,
                              decrementIteratedAxis: PositionModifier): CharConstraint[] {
        const CONSTRAINTS: CharConstraint[] = [];

        let characterPosition = 0;
        let shouldTryToFindNextChar = true;
        const CURRENT_POSITION = new WordPosition(constantAxisGetter(position),
                                                  iteratedAxisGetter(position));

        const INITIAL_CHAR = '8';
        let charAtCurrentPosition = INITIAL_CHAR;
        while (iteratedAxisGetter(CURRENT_POSITION) >= 1 &&
               charAtCurrentPosition.length !== 0) {
            decrementIteratedAxis(CURRENT_POSITION);
            const WORD_THAT_CONTAINS_POSITION =
                this.findWordThatContainsPosition(
                    words,
                    CURRENT_POSITION,
                    constantAxisGetter,
                    iteratedAxisGetter
                );
            if (WORD_THAT_CONTAINS_POSITION !== undefined) {
                charAtCurrentPosition =
                    this.charOfWordAtPosition(
                        WORD_THAT_CONTAINS_POSITION,
                        CURRENT_POSITION,
                        constantAxisGetter
                    );
            }
        }

        while (shouldTryToFindNextChar) {

            const WORD_THAT_CONTAINS_POSITION =
                this.findWordThatContainsPosition(
                    words,
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
            ++characterPosition;
        }

        return CONSTRAINTS;
    }

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
