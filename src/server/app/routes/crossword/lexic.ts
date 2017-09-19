import * as express from 'express';
import { Route } from '../middle-ware';

export class Lexic {
    constructor() {}
}

export class LexicMiddleWare {
    @Route('/crossword/lexic/filter')
    public filter(req: express.Request, res: express.Response, next: express.NextFunction): void {
    }

    @Route('/crossword/lexic/definition')
    public definitions(req: express.Request, res: express.Response, next: express.NextFunction): void {
    }
}
