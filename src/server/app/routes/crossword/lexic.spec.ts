import { LexicMiddleWare } from './lexic';
import { expect } from 'chai';

describe('The lexic MicroService', () => {

    it('should be created', () => {
        expect(new LexicMiddleWare).toBeTruthy();
    });

    let lexic: LexicMiddleWare;
    beforeEach(() => {
        lexic = new LexicMiddleWare;
    });

    it('should filter', () => {
        expect(component).toBeTruthy();
    });

    it('should seach definitions', () => {
        expect(component).toBeTruthy();
    });
});
