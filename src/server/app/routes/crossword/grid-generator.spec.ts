import { expect } from 'chai';
import { Grid, lexicon } from './grid-generator';

describe('GridGenerator', () => {
    it('should be created', () => {
        expect(new Grid()).to.not.be(undefined);
    });

    let generator: Grid;
    beforeEach( () => {
        generator = new Grid();
    });

    it('grid should have a lenght of 10', () => {
        expect(generator.gridForAcross.length == 10 && generator.gridForVertical.length == 10);
    });
});