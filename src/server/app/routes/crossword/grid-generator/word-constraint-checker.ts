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
        const CONSTRAINTS: CharConstraint[] = [];

        let characterPosition = 0;
        let shouldTryToFindCharAtNextColumn = true;
        const CURRENT_POSITION = new WordPosition(position.row, position.column);

        while (shouldTryToFindCharAtNextColumn) {

            const WORD_THAT_CONTAINS_POSITION =
                this.findVerticalWordThatContainsPosition(grid, CURRENT_POSITION);

            const CHAR_FOUND = (WORD_THAT_CONTAINS_POSITION !== undefined);

            if (CHAR_FOUND) {
                const CHARACTER = WORD_THAT_CONTAINS_POSITION.value
                                  .charAt(CURRENT_POSITION.row - WORD_THAT_CONTAINS_POSITION.position.row);
                const CHAR_CONSTRAINT: CharConstraint = {
                    char: CHARACTER,
                    position: characterPosition
                };
                CONSTRAINTS.push(CHAR_CONSTRAINT);
            }

            shouldTryToFindCharAtNextColumn = CHAR_FOUND;
            ++CURRENT_POSITION.column;
            ++characterPosition;
        }

        return CONSTRAINTS;
    }

    public getVerticalWordConstraint(grid: Grid, position: WordPosition): CharConstraint[] {
        return null;
    }

    private findVerticalWordThatContainsPosition(grid: Grid, position: WordPosition): Word {
        return grid.vertical.find((word) => {
            const MIN_ROW = word.position.row;
            const MAX_ROW = MIN_ROW + word.value.length - 1;
            const COLUMN = word.position.column;
            const WORD_CONTAINS_POSITION =
                COLUMN === position.column &&
                position.row >= MIN_ROW &&
                position.row <= MAX_ROW;
            return WORD_CONTAINS_POSITION;
        });
    }

}
