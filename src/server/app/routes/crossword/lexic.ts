import * as express from 'express';
import { Route, MiddleWare } from '../middle-ware';

export class Lexic {
    constructor() { }
}

@MiddleWare
export class LexicMiddleWare {
    @Route('get', '/crossword/lexic/filter')
    public filter(req: express.Request, res: express.Response, next: express.NextFunction): void {
        res.send('Not Implemented');
    }

    @Route('get', '/crossword/lexic/definitions')
    public definitions(req: express.Request, res: express.Response, next: express.NextFunction): void {
        res.send('Not Implemented');
    }
}
