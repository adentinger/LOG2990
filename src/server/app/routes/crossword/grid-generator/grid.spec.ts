import { expect } from 'chai';
import { Grid } from './grid';
import { Word } from './word';
import { WordPosition } from './word-position';

describe('Grid', () => {

    it('should be created', () => {
        const GRID = new Grid();
        expect(GRID).to.be.ok;
    });

    describe('doesWordAlreadyExist', () => {

        const MAKE_TEST_GRIDS = () => {
            const ACROSS_WORDS = [
                new Word('one',    new WordPosition(0, 0)),
                new Word('two',    new WordPosition(2, 6)),
                new Word('across', new WordPosition(4, 4))
            ];
            const VERTICAL_WORDS = [
                new Word('one',  new WordPosition(1, 0)),
                new Word('two',  new WordPosition(6, 3)),
                new Word('vert', new WordPosition(6, 8))
            ];

            const GRID_ACROSS = new Grid();
            const GRID_VERTICAL = new Grid();
            const GRID_BOTH = new Grid();

            GRID_ACROSS.across = ACROSS_WORDS;
            GRID_VERTICAL.vertical = VERTICAL_WORDS;
            GRID_BOTH.across = ACROSS_WORDS;
            GRID_BOTH.vertical = VERTICAL_WORDS;

            const GRIDS = [
                GRID_ACROSS,
                GRID_VERTICAL,
                GRID_BOTH
            ];

            return GRIDS;
        };

        it('should tell that a word already exists if it does', () => {
            const GRIDS = MAKE_TEST_GRIDS();
            GRIDS.forEach(grid => {
                expect(grid.doesWordAlreadyExist('one')).to.be.true;
                expect(grid.doesWordAlreadyExist('two')).to.be.true;
            });
        });

        it('should tell that a word does not exist if it does not', () => {
            const GRIDS = MAKE_TEST_GRIDS();
            GRIDS.forEach(grid => {
                expect(grid.doesWordAlreadyExist('hi')).to.be.false;
                expect(grid.doesWordAlreadyExist('there')).to.be.false;
            });
        });

    });


});
