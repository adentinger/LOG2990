import * as express from 'express';
import { Db } from 'mongodb';

import { Route, MiddleWare } from '../middle-ware';
import { HttpStatus } from '../../http-response-status';
import { WordConstraint } from './lexic/word-constraint';

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
    @Route('get', '/crossword/lexic/words')
    public words(req: express.Request, res: express.Response, next: express.NextFunction): void {
        res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
    }

    @Route('get', '/crossword/lexic/definitions')
    public definitions(req: express.Request, res: express.Response, next: express.NextFunction): void {
        res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
    }
}
