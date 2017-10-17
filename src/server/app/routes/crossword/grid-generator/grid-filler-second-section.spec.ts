import { expect } from 'chai';
import { GridFillerSecondSection } from './grid-filler-second-section';
import { Grid, Difficulty } from './grid';

describe('GridFillerSecondSection', () => {

    let filler: GridFillerSecondSection;

    beforeEach(() => {
        filler = new GridFillerSecondSection(Difficulty.easy);
    });

    it('should be created', () => {
        expect(filler).to.be.ok;
    });

    it('should fill grids', () => {
        const GRID = new Grid();
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
