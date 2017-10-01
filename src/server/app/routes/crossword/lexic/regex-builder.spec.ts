import { expect } from 'chai';
import { WordConstraint } from './word-constraint';
import { RegexBuilder } from './regex-builder';

describe('RegexBuilder', () => {
    let regexBuilder: RegexBuilder;
    beforeEach(() => {
        regexBuilder = new RegexBuilder();
    });

    describe('buildFromConstraint', () => {
        it('should create an empty Regexp from an empty word constraint', (done) => {
            const emptyWordConstraint: WordConstraint = { charConstraints: [], isCommon: true, minLength: 0 };
            expect(regexBuilder.buildFromConstraint(emptyWordConstraint)).to.have.property('source', '^$')
                .and.to.have.property('flags', 'i');
            done();
        });
        it('should create a valid Regexp from a valid word constraint', (done) => {
            let validConstraint: WordConstraint;
            validConstraint = { charConstraints: [{ char: 'a', position: 2 }], isCommon: true, minLength: 3 };
            expect(regexBuilder.buildFromConstraint(validConstraint)).to.have.property('source', '^.{2}a$')
                .and.to.have.property('flags', 'i');
            validConstraint = { charConstraints: [{ char: 'a', position: 1 }], isCommon: true, minLength: 3 };
            expect(regexBuilder.buildFromConstraint(validConstraint)).to.have.property('source', '^.{1}a.{1}$')
                .and.to.have.property('flags', 'i');
            validConstraint = { charConstraints: [{ char: 'a', position: 0 }], isCommon: true, minLength: 3 };
            expect(regexBuilder.buildFromConstraint(validConstraint)).to.have.property('source', '^a.{2}$')
                .and.to.have.property('flags', 'i');
            validConstraint = { charConstraints: [{ char: 'a', position: 0 }, { char: 'b', position: 2 }], isCommon: true, minLength: 3 };
            expect(regexBuilder.buildFromConstraint(validConstraint)).to.have.property('source', '^a.{1}b$')
                .and.to.have.property('flags', 'i');
            validConstraint = { charConstraints: [{ char: 'a', position: 1 }, { char: 'b', position: 2 }], isCommon: true, minLength: 3 };
            expect(regexBuilder.buildFromConstraint(validConstraint)).to.have.property('source', '^.{1}ab$')
                .and.to.have.property('flags', 'i');
            validConstraint = {
                charConstraints: [{ char: 'a', position: 1 }, { char: 'b', position: 2 }],
                isCommon: true, minLength: 3, maxLength: 9
            };
            expect(regexBuilder.buildFromConstraint(validConstraint)).to.have.property('source', '^.{1}ab.{0,6}$')
                .and.to.have.property('flags', 'i');
            done();
        });
        it('should return null with an invalid constraint', (done) => {
            let invalidWordConstraint: WordConstraint;
            invalidWordConstraint = {
                charConstraints: [{ char: 'a', position: 1 }, { char: 'b', position: 2 }],
                isCommon: true, minLength: 2
            };
            expect(regexBuilder.buildFromConstraint(invalidWordConstraint)).to.be.null;
            invalidWordConstraint = {
                charConstraints: [{ char: 'a', position: 1 }, { char: 'b', position: 2 }],
                isCommon: true, minLength: 2, maxLength: 1
            };
            expect(regexBuilder.buildFromConstraint(invalidWordConstraint)).to.be.null;
            invalidWordConstraint = {
                charConstraints: [{ char: 'a', position: 1 }, { char: 'b', position: 2 }],
                isCommon: true, minLength: -2, maxLength: 1
            };
            expect(regexBuilder.buildFromConstraint(invalidWordConstraint)).to.be.null;
            invalidWordConstraint = {
                charConstraints: [{ char: 'a', position: 1 }, { char: 'b', position: 2 }],
                isCommon: true, minLength: 2, maxLength: -1
            };
            expect(regexBuilder.buildFromConstraint(invalidWordConstraint)).to.be.null;
            invalidWordConstraint = {
                charConstraints: [{ char: 'a', position: 1 }, { char: 'b', position: 1 }],
                isCommon: true, minLength: 2
            };
            expect(regexBuilder.buildFromConstraint(invalidWordConstraint)).to.be.null;
            done();
        });
    });
});
