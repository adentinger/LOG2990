import * as express from 'express';
interface CharConstraint{position: number; char: string;}
export class LexicMiddleWare {

    private privateFilter (commonality: boolean, length: number, letters: CharConstraint[]) {
    }

    public filter(req: express.Request, res: express.Response, next: express.NextFunction): void {
    }

    public definitions(req: express.Request, res: express.Response, next: express.NextFunction): void {
    }
}
