import { Lexic } from './lexic';
import { expect } from 'chai';
import { Db } from 'mongodb';
import { WordConstraint } from './lexic/word-constraint';
import { provideDatabase } from '../../app-db';

const DB_PROVIDER: Promise<Db> = provideDatabase();

describe('The lexic MicroService', () => {
    it('should be created', (done) => {
        const CONSTRUCTOR = () => new Lexic(DB_PROVIDER);
        expect(CONSTRUCTOR).to.not.throw();
        done();
    });

    let lexic: Lexic;
    beforeEach(() => {
        lexic = new Lexic(DB_PROVIDER);
    });

    xdescribe('has a Filter that', () => {
        const CONSTRAINT: WordConstraint = {
            charConstraints: [{ char: 'b', position: 1 }, { char: 'a', position: 0 }],
            isCommon: true,
            minLength: 5
        };
        it('should give a list of words that correspond to valid constraints', (done) => {
            lexic.getWords(CONSTRAINT).then((words: string[]) => {
                expect(words).to.be.an.instanceOf(Array);
                words.forEach((word: string) => {
                    expect(word).to.match(/^ab.{3,}/i);
                });
                done();
            }, (error) => {
                expect(error).to.not.be.an.instanceOf(Error);
                done();
            }).catch(done);
        });
    });

    xit('should fetch the definitions of a given word', () => {
        expect(lexic).to('object', 'do something...');
    });
});
