import * as express from 'express';
import { Db } from 'mongodb';

import { Route, MiddleWare } from '../middle-ware';
import { HttpStatus } from '../../http-response-status';
import { WordConstraint, isWordConstraint } from './lexic/word-constraint';
import { provideDatabase } from '../../app-db';

export const LEXIC_WORDS_COLLECTION = 'crossword-lexic-words';

export class Lexic {
    constructor(private databaseProvider: Promise<Db>) { }

    public getWords(constraint: WordConstraint): Promise<string[]> {
        return Promise.reject(new Error('Not implemented'));
    }

    public getDefinitions(word: string): Promise<string[]> {
        return Promise.reject(new Error('Not implemented'));
    }
}

@MiddleWare
export class LexicMiddleWare {
    private static readonly LEXIC = new Lexic(provideDatabase());

    @Route('get', '/crossword/lexic/words')
    public words(req: express.Request, res: express.Response, next: express.NextFunction): void {
        let constraint: WordConstraint;
        try {
            if (('constraint' in req.query) &&
                (constraint = JSON.parse(req.query.constraint)) &&
                isWordConstraint(constraint)) {
                LexicMiddleWare.LEXIC.getWords(constraint).then((words) => {
                    res.json(words);
                }).catch((reason: any) => {
                    console.warn('Warning:', reason);
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
                    res.json(reason);
                });
                return;
            }
            console.log('Bad query string:', req.query);
        } catch (e) {
            console.warn('Warning:', (e as Error).message);
            res.status(HttpStatus.UNKNOWN_ERROR);
            res.send(e.toString());
            return;
        }
        res.sendStatus(HttpStatus.BAD_REQUEST);
    }

    @Route('get', '/crossword/lexic/definitions')
    public definitions(req: express.Request, res: express.Response, next: express.NextFunction): void {
        res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
    }
}
