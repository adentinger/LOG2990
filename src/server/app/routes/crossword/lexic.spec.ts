import { LexicMiddleWare } from './lexic';
import { expect } from 'chai';

describe('The lexic MicroService', () => {

    it('should be created', () => {
        expect(new LexicMiddleWare).to.not.be(null);
    });

    let lexic: LexicMiddleWare;
    beforeEach(() => {
        lexic = new LexicMiddleWare;
    });

    xit('should filter', () => {
        expect(lexic);
    });

    xit('should seach definitions', () => {
        expect(lexic);
    });
});
