import { Lexic } from './lexic';
import { expect } from 'chai';

describe('The lexic MicroService', () => {
    it('should be created', () => {
        expect(new Lexic).to.not.be(null);
    });

    let lexic: Lexic;
    beforeEach(() => {
        lexic = new Lexic;
    });

    xit('should filter', () => {
        expect(lexic);
    });

    xit('should seach definitions', () => {
        expect(lexic);
    });
});
