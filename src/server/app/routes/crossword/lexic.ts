import * as express from 'express';
import { Db, MongoError, Collection } from 'mongodb';

import { Route, MiddleWare } from '../middle-ware';
import { HttpStatus } from '../../http-response-status';
import { WordConstraint, isWordConstraint, parseWordConstraint } from 'common/lexic/word-constraint';
import { provideDatabase } from '../../app-db';
import { isJson } from 'common/utils';
import { RegexBuilder } from './lexic/regex-builder';
import { ExternalWordApiService } from './lexic/external-word-api.service';
import { CharConstraint } from 'common/lexic/char-constraint';

interface WordDocument {
    _id: string;
    value: string;
    frequency: number;
}

export class Lexic {
    public static readonly LEXIC_WORDS_COLLECTION = 'crossword-lexic-words';
    public static readonly COMMONALITY_FREQUENCY_THREASHOLD = 1000;
    private wordCollection: Collection<WordDocument> = null;

    constructor(private databaseProvider: Promise<Db>,
        private regexBuilder: RegexBuilder,
        private externalWordApiService: ExternalWordApiService) {
        databaseProvider.then((db: Db) => {
            db.collection(Lexic.LEXIC_WORDS_COLLECTION, (error: MongoError, wordCollection: Collection<WordDocument>) => {
                this.wordCollection = wordCollection;
            });
        });
    }

    /**
     * Check if all given word entries have a frequency. If one doesn't, it fetches the word' frequency
     * from an external API and updates it on the database.
     * @param words List of word entries from the database to check if they have a frequency or not.
     */
    private ensureFrequencies(words: WordDocument[]): Promise<WordDocument[]> {
        if (this.wordCollection === null) {
            return Promise.reject(new Error('MongoDB\'s word Collection unavailable'));
        }
        return Promise.all(words.map((word) => {
            if (!Number.isFinite(word.frequency)) {
                return this.externalWordApiService.getFrequency(word.value)
                    .then((frequency: number) => {
                        word.frequency = frequency;
                        return this.wordCollection.updateOne({ _id: word._id }, { $set: { frequency: frequency } })
                            .then((result) => {
                                if (result.modifiedCount > 0) {
                                    return word;
                                }
                                throw new Error(word.value + ' not updated');
                            });
                    }).catch(() => {
                        return word;
                    });
            }
            return Promise.resolve(word);
        }));
    }

    private fetchWords(constraint: WordConstraint, resolve: (value: string[]) => void, reject: (reason?: any) => void) {
        const REGEX = this.regexBuilder.buildFromConstraint(constraint);
        if (REGEX === null) {
            reject(new Error('Invalid WordConstraint'));
            return;
        }
        const COMMONALITY_FILTER = constraint.isCommon ?
            (word: WordDocument) => Number.isFinite(word.frequency) && word.frequency >= Lexic.COMMONALITY_FREQUENCY_THREASHOLD :
            (word: WordDocument) => Number.isFinite(word.frequency) && word.frequency < Lexic.COMMONALITY_FREQUENCY_THREASHOLD;
        const SEARCH_OPTION = { value: { $regex: REGEX } };
        this.wordCollection.find(SEARCH_OPTION, { value: true, frequency: true })
            .toArray()
            .then(this.ensureFrequencies.bind(this))
            .then((wordDocuments) => {
                const words = wordDocuments.filter(COMMONALITY_FILTER).map((value) => value.value);
                if (words.length === 0) {
                    throw new Error('Requested words not found');
                }
                return words;
            })
            .then(resolve, reject);
    }

    public getWords(constraint: WordConstraint): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.databaseProvider.then((db: Db) => {
                if (this.wordCollection !== null) {
                    this.fetchWords(constraint, resolve, reject);
                } else {
                    db.collection(Lexic.LEXIC_WORDS_COLLECTION, (error: MongoError, wordCollection: Collection<WordDocument>) => {
                        if (error) {
                            reject(error);
                            return;
                        }
                        this.wordCollection = wordCollection;
                        this.fetchWords(constraint, resolve, reject);
                    });
                }
            });
        });
    }

    public getDefinitions(word: string): Promise<string[]> {
        return this.externalWordApiService.getDefinitions(word);
    }
}

@MiddleWare('/crossword/lexic')
export class LexicMiddleWare {
    private static readonly LEXIC = new Lexic(provideDatabase(), new RegexBuilder(), new ExternalWordApiService());

    private static parseQuery(query: any): WordConstraint {
        let minLength: number = query.minLength,
            maxLength: number = query.maxLength,
            isCommon = false,
            charConstraints: CharConstraint[] = [];
        if ('minLength' in query) {
            minLength = Number(query.minLength);
        }
        if ('isCommon' in query) {
            isCommon = typeof query.isCommon === 'string' ? query.isCommon === 'true' : Boolean(query.isCommon);
        }
        if ('charConstraints' in query) {
            if (typeof query.charConstraints === 'string' && isJson(query.charConstraints)) {
                charConstraints = JSON.parse(query.charConstraints);
            } else if (Array.isArray(query.charConstraints)) {
                charConstraints = query.charConstraints;
            }
        }
        if ('maxLength' in query) {
            maxLength = Number(query.maxLength);
            return <WordConstraint>{ minLength, maxLength, isCommon, charConstraints };
        } else {
            return <WordConstraint>{ minLength, isCommon, charConstraints };
        }
    }

    @Route('get', '/words')
    public words(req: express.Request, res: express.Response, next: express.NextFunction): void {
        let initialQuery;
        initialQuery = LexicMiddleWare.parseQuery(req.query);
        if (isWordConstraint(initialQuery)) {
            const CONSTRAINT: WordConstraint = parseWordConstraint(initialQuery);
            LexicMiddleWare.LEXIC.getWords(CONSTRAINT).then((words) => {
                res.json(words);
            }).catch((reason: any) => {
                reason = reason instanceof Error ? reason.message : reason;
                console.warn(reason);
                res.status((/not.*found/i).test(reason) ? HttpStatus.NOT_FOUND :
                    ((/Invalid Word\s*Constraint/i).test(reason)) ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR);
                res.send(reason);
            });
        } else {
            console.log('Bad query string:', req.query);
            res.sendStatus(HttpStatus.BAD_REQUEST);
        }
    }

    @Route('get', '/definitions/:word')
    public definitions(req: express.Request, res: express.Response, next: express.NextFunction): void {
        console.log(req.params);
        LexicMiddleWare.LEXIC.getDefinitions(req.params.word).then((definitions: string[]) => {
            res.json(definitions);
        }).catch((error: any) => {
            console.warn(error instanceof Error ? error.message : error);
            res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        });
    }
}
