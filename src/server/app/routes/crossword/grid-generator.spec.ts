import { expect } from 'chai';
import { Grid } from './grid-generator';

let puzzle = new Grid(10);
describe('#Grid', () => {
    it('Object Grid is generated', ()=> {
        expect(puzzle).is.not.undefined;
    });
});

describe('#Grid is squared and 10x10', () => {
    it('Grid is length 10', () => {
        expect(puzzle.grid.length).to.be.equal(10);
    });

    it('Grid is length 10 for each row', ()=> {
        for (let i = 0; i < puzzle.grid.length; i ++) {
            expect(puzzle.grid[i].length).to.be.equal(10);
        }
    });
});

/*
describe('#', () => {
    it('Each column contains 1 or 2 words', ()=> {
        for (let i = 0; i < puzzle.gridForPosition.length; i++) {
            for (let j = 0; j < puzzle.gridForPosition[i].length; j++) {
                expect(puzzle.gridForPosition[i][j]).to.be.equal
            }
        }
    });
});
*/