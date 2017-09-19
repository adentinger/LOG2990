import * as express from 'express';
import { Route, MiddleWare } from '../middle-ware';

export class Lexic {
    constructor() {}
}

@MiddleWare
export class LexicMiddleWare {
    @Route('get', '/crossword/lexic/filter')
    public filter(req: express.Request, res: express.Response, next: express.NextFunction): void {
    }

    @Route('get', '/crossword/lexic/definition')
    public definitions(req: express.Request, res: express.Response, next: express.NextFunction): void {
    }
}
