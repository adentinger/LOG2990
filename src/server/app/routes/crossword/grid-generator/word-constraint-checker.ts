import { CharConstraint } from '../../../common/index';
import { Grid } from './grid';
import { WordPosition } from './word-position';

export class WordConstraintChecker {

    private static INSTANCE = new WordConstraintChecker();

    private constructor() {}

    public static getInstance(): WordConstraintChecker {
        return WordConstraintChecker.INSTANCE;
    }

    public getAcrossWordConstraint(grid: Grid, position: WordPosition): CharConstraint[] {
        return null;
    }

    public getVerticalWordConstraint(grid: Grid, position: WordPosition): CharConstraint[] {
        return null;
    }

}
