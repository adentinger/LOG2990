import * as express from 'express';
import { Db, MongoError, Collection } from 'mongodb';

import { Route, MiddleWare } from '../middle-ware';
import { HttpStatus } from '../../http-response-status';
import { WordConstraint, isWordConstraint, parseWordConstraint } from './lexic/word-constraint';
import { provideDatabase } from '../../app-db';
import { PrefixLogWith, isJson } from 'common/utils';
import { RegexBuilder } from './lexic/regex-builder';
import { ExternalWordApiService } from './lexic/external-word-api.service';

interface WordDocument {
    _id: string;
    value: string;
    frequency: number;
}

export class Lexic {
    public static readonly LEXIC_WORDS_COLLECTION = 'crossword-lexic-words';
    public static readonly COMMONALITY_FREQUENCY_THREASHOLD = 1000;
    constructor(private databaseProvider: Promise<Db>,
        private regexBuilder: RegexBuilder,
        private externalWordApiService: ExternalWordApiService) { }

    public getWords(constraint: WordConstraint): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const REGEX = this.regexBuilder.buildFromConstraint(constraint);
            if (REGEX === null) {
                reject(new Error('Invalid WordConstraint'));
                return;
            }
            console.log(REGEX);
            const COMMONALITY_FILTER = constraint.isCommon ?
                (word: WordDocument) => Number.isFinite(word.frequency) && word.frequency >= Lexic.COMMONALITY_FREQUENCY_THREASHOLD :
                (word: WordDocument) => Number.isFinite(word.frequency) && word.frequency < Lexic.COMMONALITY_FREQUENCY_THREASHOLD;
            this.databaseProvider.then((db: Db) => {
                db.collection(Lexic.LEXIC_WORDS_COLLECTION, (error: MongoError, wordCollection: Collection<WordDocument>) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    const SEARCH_OPTION = {
                        value: { $regex: REGEX }
                    };
                    wordCollection.find(SEARCH_OPTION, { value: true, frequency: true })
                        .toArray()
                        .then((words) => {
                            return Promise.all(words.map((word) => {
                                if (!Number.isFinite(word.frequency)) {
                                    return this.externalWordApiService.getFrequency(word.value)
                                        .then((frequency: number) => {
                                            word.frequency = frequency;
                                            return wordCollection.updateOne({ _id: word._id }, { $set: { frequency: frequency } })
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
                        })
                        .then((wordDocuments) => {
                            const words = wordDocuments.filter(COMMONALITY_FILTER).map((value) => value.value);
                            if (words.length === 0) {
                                throw new Error('Requested words not found');
                            }
                            return words;
                        })
                        .then(resolve, reject);
                });
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

    @Route('get', '/words')
    @PrefixLogWith('[lexic/words]')
    public words(req: express.Request, res: express.Response, next: express.NextFunction): void {
        if (req.query && 'charConstraints' in req.query &&
            typeof req.query['charConstraints'] === 'string' &&
            isJson(req.query['charConstraints'])) {
            req.query.charConstraints = JSON.parse(req.query.charConstraints);
        }
        req.query.isCommon = typeof req.query.isCommon === 'string' ? req.query.isCommon === 'true' : Boolean(req.query.isCommon);
        req.query.minLength = Number(req.query.minLength);
        if (req.query.maxLength) {
            req.query.maxLength = Number(req.query.maxLength);
        }
        if (isWordConstraint(req.query)) {
            const CONSTRAINT: WordConstraint = parseWordConstraint(req.query);
            LexicMiddleWare.LEXIC.getWords(CONSTRAINT).then((words) => {
                res.json(words);
            }).catch((reason: any) => {
                reason = reason instanceof Error ? reason.message : reason;
                console.warn(reason);
                res.status(HttpStatus.INTERNAL_SERVER_ERROR);
                res.send(reason);
            });
        } else {
            console.log('Bad query string:', req.query);
            res.sendStatus(HttpStatus.BAD_REQUEST);
        }
    }

    @Route('get', '/definitions/:word')
    @PrefixLogWith('[lexic/definitions]')
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
