import { CharConstraint } from '../../../common/index';
import { Grid } from './grid';
import { WordPosition } from './word-position';
import { Word } from './word';

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
            (wordPosition) => { ++wordPosition.column; });
    }

    public getVerticalWordConstraint(grid: Grid, position: WordPosition): CharConstraint[] {
        return this.getWordConstraint(
            grid.across,
            position,
            (wordPosition) => wordPosition.row,
            (wordPosition) => wordPosition.column,
            (wordPosition) => { ++wordPosition.row; });
    }

    private getWordConstraint(words: Word[],
                              position: WordPosition,
                              iteratedAxisGetter: (position: WordPosition) => number,
                              constantAxisGetter: (position: WordPosition) => number,
                              incrementIteratedAxis: (position: WordPosition) => void): CharConstraint[] {
        const CONSTRAINTS: CharConstraint[] = [];

        let characterPosition = 0;
        let shouldTryToFindNextChar = true;
        const CURRENT_POSITION = new WordPosition(constantAxisGetter(position),
                                                  iteratedAxisGetter(position));

        while (shouldTryToFindNextChar) {

            const WORD_THAT_CONTAINS_POSITION =
                this.findWordThatContainsPosition(
                    words,
                    CURRENT_POSITION,
                    constantAxisGetter,
                    iteratedAxisGetter);

            const CHAR_FOUND = (WORD_THAT_CONTAINS_POSITION !== undefined);

            if (CHAR_FOUND) {
                const CHARACTER = WORD_THAT_CONTAINS_POSITION.value
                                    .charAt(constantAxisGetter(CURRENT_POSITION) -
                                            constantAxisGetter(WORD_THAT_CONTAINS_POSITION.position));
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
                                         constantAxisGetter: (position: WordPosition) => number,
                                         iteratedAxisGetter: (position: WordPosition) => number): Word {
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

}
