import { Lexic } from './lexic';
import { expect } from 'chai';

describe('The lexic MicroService', () => {
    it('should be created', () => {
        expect(new Lexic).to.not.throw().and.to.not.be.null('allo');
    });

    let lexic: Lexic;
    beforeEach(() => {
        lexic = new Lexic();
    });

    it('should filter', () => {
        expect(lexic);
    });

    it('should seach definitions', () => {
        expect(lexic);
    });
});
