import { expect } from 'chai';

import { WordConstraintChecker } from './word-constraint-checker';
import { Grid } from './grid';
import { Word } from './word';
import { WordPosition } from './word-position';
import { CharConstraint } from '../../../common/index';

function getTestData(): {words: Word[],
                         positions: WordPosition[],
                         expectedConstraints: CharConstraint[][]} {
    const WORDS: Word[] = [
        new Word('hello', new WordPosition(0, 0)),
        new Word('baz',   new WordPosition(0, 1)),
        new Word('qux',   new WordPosition(0, 2))
    ];
    const POSITIONS: WordPosition[] = [
        new WordPosition(0, 0),
        new WordPosition(2, 0),
        new WordPosition(3, 0),
        new WordPosition(5, 0)
    ];
    const EXPECTED_CONSTRAINTS: CharConstraint[][] = [
        [
            {char: 'h', position: 0},
            {char: 'b', position: 1},
            {char: 'q', position: 2}
        ],
        [
            {char: 'l', position: 0},
            {char: 'z', position: 1},
            {char: 'x', position: 2}
        ],
        [
            {char: 'l', position: 0}
        ],
        [ ]
    ];
    return {
        words: WORDS,
        positions: POSITIONS,
        expectedConstraints: EXPECTED_CONSTRAINTS
    };
}

describe('WordConstraintChecker', () => {

    describe('getAcrossWordConstraint', () => {
        it('should find the word constraint for a valid position', () => {
            const {
                words: VERTICAL_WORDS,
                positions: POSITIONS,
                expectedConstraints: EXPECTED_CONSTRAINTS
            } = getTestData();
            const GRID = new Grid();
            GRID.vertical = VERTICAL_WORDS;

            for (let i = 0; i < POSITIONS.length; ++i) {
                expect(WordConstraintChecker.getInstance()
                    .getAcrossWordConstraint(GRID, POSITIONS[i]))
                    .to.deep.equal(EXPECTED_CONSTRAINTS[i]);
            }
        });
    });

    describe('getVerticalWordConstraint', () => {
        it('should find the word constraint for a valid position', () => {
            const {
                words: ACROSS_WORDS,
                positions: POSITIONS,
                expectedConstraints: EXPECTED_CONSTRAINTS
            } = getTestData();
            const GRID = new Grid();
            GRID.across = ACROSS_WORDS;

            for (let i = 0; i < POSITIONS.length; ++i) {
                expect(WordConstraintChecker.getInstance()
                    .getAcrossWordConstraint(GRID, POSITIONS[i]))
                    .to.deep.equal(EXPECTED_CONSTRAINTS[i]);
            }
        });
    });

});
