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
            this.databaseProvider.then((db: Db) => {
                db.collection(Lexic.LEXIC_WORDS_COLLECTION, (error: MongoError, words: Collection<WordDocument>) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    const SEARCH_OPTION = {
                        _id: { $regex: REGEX }
                    };
                    const CURSOR = words.find(SEARCH_OPTION);
                    CURSOR.map((wordEntry: WordDocument) => {
                        console.log('word:', wordEntry.value);
                        if (wordEntry.frequency == null) {
                            return this.externalWordApiService.getFrequency(wordEntry.value)
                                .then((frequency) => wordEntry.frequency = frequency)
                                .then(() => words.updateOne({_id: wordEntry._id}, wordEntry))
                                .then(() => wordEntry);
                        } else {
                            return Promise.resolve(wordEntry);
                        }
                    })
                    .filter({frequency:{$gt: { $gt: Lexic.COMMONALITY_FREQUENCY_THREASHOLD }}})
                    .toArray().then((wordArray: WordDocument[]) => {
                        resolve(wordArray.map((word) => word.value));
                    })
                    .catch(reject);
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
        req.query.isCommon = Boolean(req.query.isCommon);
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
