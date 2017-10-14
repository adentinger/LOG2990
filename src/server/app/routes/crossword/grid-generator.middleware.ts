import * as express from 'express';
import { Route, MiddleWare } from '../middle-ware';
import { HttpStatus } from '../../http-response-status';
import { GridGenerator } from './grid-generator/grid-generator';
import { Difficulty } from './grid-generator/grid';

@MiddleWare('/crossword/grid-generator')
export class GridGeneratorMiddleware {
    @Route('get', '/easy')
    public getEasy(req: express.Request, res: express.Response):void {
        let gridGenerator = new GridGenerator(Difficulty.easy);
        res.status(HttpStatus.OK);
        res.json(gridGenerator.gridGeneration());
        res.send();
    }
}
