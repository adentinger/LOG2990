import * as express from 'express';
import { Db } from 'mongodb';

import { Route, MiddleWare } from '../middle-ware';
import { HttpStatus } from '../../http-response-status';
import { WordConstraint, isWordConstraint, parseWordConstraint } from './lexic/word-constraint';
import { provideDatabase } from '../../app-db';
import { PrefixLogWith, isJson } from 'common/utils';
import { RegexBuilder } from './lexic/regex-builder';
import { ExternalWordApiService } from './lexic/external-word-api.service';

export const LEXIC_WORDS_COLLECTION = 'crossword-lexic-words';

export class Lexic {
    constructor(private databaseProvider: Promise<Db>,
        private regexBuilder: RegexBuilder,
        private externalWordApiService: ExternalWordApiService) { }

    public getWords(constraint: WordConstraint): Promise<string[]> {
        return Promise.reject(new Error('Not implemented'));
    }

    public getDefinitions(word: string): Promise<string[]> {
        console.log('word:', word);
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
