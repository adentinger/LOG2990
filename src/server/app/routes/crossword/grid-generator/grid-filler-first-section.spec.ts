import { expect } from 'chai';
import { GridFillerFirstSection } from './grid-filler-first-section';
import { Grid, Difficulty } from './grid';

describe('GridFillerFirstSection', () => {

    let filler: GridFillerFirstSection;

    beforeEach(() => {
        filler = new GridFillerFirstSection();
    });

    it('should be created', () => {
        expect(filler).to.be.ok;
    });

    it('should fill grids', () => {
        const GRID = new Grid(Difficulty.easy);
        filler.fill(GRID);
        expect(GRID.isCurrentlyValid).to.be.true;
        filler.acrossPlacement.forEach((placement) => {
            const MATCH_INDEX = GRID.across.findIndex((acrossWord) => {
                const WORD_LENGTH_MATCHES =
                    acrossWord.value.length >= placement.minLength &&
                    acrossWord.value.length <= placement.maxLength;
                const PLACEMENT_MATCHES = placement.position.equals(acrossWord.position);
                return WORD_LENGTH_MATCHES && PLACEMENT_MATCHES;
            });
            expect(MATCH_INDEX).to.be.gte(0, 'Placement requirement not met');
        });
    });

});
