import * as express from 'express';
import { Db } from 'mongodb';

import { Route, MiddleWare } from '../middle-ware';
import { HttpStatus } from '../../http-response-status';
import { WordConstraint, isWordConstraint, parseWordConstraint } from './lexic/word-constraint';
import { provideDatabase } from '../../app-db';
import { PrefixLogWith } from '../../../../common/utils';

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

@MiddleWare('/crossword/lexic')
export class LexicMiddleWare {
    private static readonly LEXIC = new Lexic(provideDatabase());

    @Route('get', '/words')
    @PrefixLogWith('[lexic/words]')
    public words(req: express.Request, res: express.Response, next: express.NextFunction): void {
        if (isWordConstraint(req.query)) {
            const CONSTRAINT: WordConstraint = parseWordConstraint(req.query);
            LexicMiddleWare.LEXIC.getWords(CONSTRAINT).then((words) => {
                res.json(words);
            }).catch((reason: any) => {
                console.warn(reason instanceof Error ? reason.message : reason);
                res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
            });
        } else {
            console.log('Bad query string:', req.query);
            res.sendStatus(HttpStatus.BAD_REQUEST);
        }
    }

    @Route('get', '/definitions/:word')
    @PrefixLogWith('[lexic/definitions]')
    public definitions(req: express.Request, res: express.Response, next: express.NextFunction): void {
        console.warn('Not Implemented');
        res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
    }
}
