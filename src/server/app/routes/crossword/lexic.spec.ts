import { Lexic } from './lexic';
import { expect } from 'chai';
import { Db } from 'mongodb';
import { WordConstraint } from './lexic/word-constraint';
import { provideDatabase } from '../../app-db';
import { RegexBuilder } from './lexic/regex-builder';
import { ExternalWordApiService } from './lexic/external-word-api.service';

const DB_PROVIDER: Promise<Db> = provideDatabase();
const RX_BUILDER = new RegexBuilder();

class ExternalWordApiServiceMock extends ExternalWordApiService {

    private readonly mockDefinitions: {[index: string]: string[]} = {
        banana: ['fruit', 'boomrang-like object']
    };

    constructor() {
        super();
    }

    public getDefinitions(word: string): Promise<string[]> {
        if (word in this.mockDefinitions) {
            return Promise.resolve(this.mockDefinitions[word]);
        } else {
            return Promise.reject(new Error('word not found'));
        }
    }
}

const externalWrdApiService = new ExternalWordApiServiceMock();

describe('The lexic MicroService', () => {
    it('should be created', (done) => {
        const CONSTRUCTOR = () => new Lexic(DB_PROVIDER, RX_BUILDER, externalWrdApiService);
        expect(CONSTRUCTOR).to.not.throw();
        done();
    });

    let lexic: Lexic;
    beforeEach(() => {
        lexic = new Lexic(DB_PROVIDER, RX_BUILDER, externalWrdApiService);
    });

    xdescribe('has a Filter that', () => {
        const CONSTRAINTS: [WordConstraint, RegExp][] = [[{
            charConstraints: [{ char: 'b', position: 1 }, { char: 'a', position: 0 }],
            isCommon: true,
            minLength: 5
        }, (/^ab.{3}$/i)], [{
            charConstraints: [{ char: '1', position: 1 }, { char: 'a', position: 0 }],
            isCommon: true,
            minLength: 5
        }, null], [{
            charConstraints: [{ char: 'b', position: -1 }, { char: 'a', position: 0 }],
            isCommon: true,
            minLength: 5
        }, null], [{
            charConstraints: [{ char: 'b', position: 1 }, { char: 'a', position: 0 }],
            isCommon: true,
            minLength: -1
        }, null], [{
            charConstraints: [{ char: 'b', position: 1 }, { char: 'a', position: 1 }],
            isCommon: true,
            minLength: -1
        }, null]];

        it('should give a list of words that correspond to valid constraints', (done) => {
            for (let i = 0; i < CONSTRAINTS.length; i++) {
                lexic.getWords(CONSTRAINTS[i][0]).then((words: string[]) => {
                    expect(words).to.be.an.instanceOf(Array);
                    words.forEach((word: string) => {
                        expect(word).to.match(CONSTRAINTS[i][1]);
                    });
                    done();
                }, (error) => {
                    expect(CONSTRAINTS[i][1]).to.be.null;
                    done();
                }).catch(done);
            }
        });
    });

    xit('should fetch the definitions of a given word', (done) => {
        lexic.getDefinitions('banana').then((definitions: string[]) => {
            expect(definitions).to.contain('fruit').and.to.contain('boomrang-like object');
            done();
        });
    });
});
