import { expect } from 'chai';

import { WordConstraintChecker } from './word-constraint-checker';
import { Grid } from './grid';
import { Word } from './word';
import { WordPosition } from './word-position';
import { CharConstraint } from '../../../common/index';

function getTestData(isForAcross: boolean): {words: Word[],
                                               positions: WordPosition[],
                                               expectedConstraints: CharConstraint[][]} {
    const WORD_POSITIONS: WordPosition[] = [
        new WordPosition(0, 0),
        new WordPosition(0, 1),
        new WordPosition(0, 2)
    ];

    const WORDS: Word[] = [
        new Word('hello', WORD_POSITIONS[0]),
        new Word('baz',   WORD_POSITIONS[1]),
        new Word('qux',   WORD_POSITIONS[2])
    ];
    const POSITIONS: WordPosition[] = [
        new WordPosition(0, 0),
        new WordPosition(2, 1),
        new WordPosition(3, 2),
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
        [],
        [
            {char: 'l', position: 0}
        ],
        []
    ];
    if (!isForAcross) {
        const SWAP_ROW_COLUMN = (position: WordPosition) => {
                const ROW = position.column;
                const COLUMN = position.row;
                position.row = ROW;
                position.column = COLUMN;
            };
        WORD_POSITIONS.forEach(SWAP_ROW_COLUMN);
        POSITIONS.forEach(SWAP_ROW_COLUMN);
    }
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
            } = getTestData(true);
            const GRID = new Grid();
            GRID.vertical = VERTICAL_WORDS;

            for (let i = 0; i < POSITIONS.length; ++i) {
                expect(WordConstraintChecker.getInstance()
                    .getAcrossWordConstraint(GRID, POSITIONS[i], 3))
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
            } = getTestData(false);
            const GRID = new Grid();
            GRID.across = ACROSS_WORDS;

            for (let i = 0; i < POSITIONS.length; ++i) {
                const CONSTRAINTS = WordConstraintChecker.getInstance()
                        .getVerticalWordConstraint(GRID, POSITIONS[i], 3);
                expect(CONSTRAINTS)
                    .to.deep.equal(EXPECTED_CONSTRAINTS[i]);
            }
        });
    });

});
