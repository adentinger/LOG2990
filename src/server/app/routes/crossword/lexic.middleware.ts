import * as express from 'express';

import { Route, MiddleWare } from '../middle-ware';
import { HttpStatus } from '../../http-response-status';
import { WordConstraint, isWordConstraint, parseWordConstraint } from 'common/lexic/word-constraint';
import { provideDatabase } from '../../app-db';
import { isJson } from 'common/utils';
import { CharConstraint } from 'common/lexic/char-constraint';
import { RegexBuilder } from './lexic/regex-builder';
import { Lexic } from './lexic';
import { ExternalWordApiService } from './lexic/external-word-api.service';


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
