import { expect } from 'chai';
import { GridFillerFirstSection } from './grid-filler-first-section';
import { Grid, Difficulty } from './grid';

describe('GridFillerFirstSection', () => {

    let filler: GridFillerFirstSection;

    beforeEach(() => {
        filler = new GridFillerFirstSection();
    });

    it('should fill grids', () => {
        const GRID = new Grid(Difficulty.easy);
        filler.fill(GRID);
        expect(GRID.isCurrentlyValid).to.be.true;
        GRID.across.forEach((acrossWord) => {
            expect(acrossWord.position)
        });
    });

});
