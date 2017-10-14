import * as express from 'express';
import { Route, MiddleWare } from '../middle-ware';
import { HttpStatus } from '../../http-response-status';
import { GridGenerator } from './grid-generator/grid-generator';
import { Difficulty } from './grid-generator/grid';

@MiddleWare('/crossword/grid-generator')
export class GridGeneratorMiddleware {
    @Route('get', '/easy')
    public getEasyGrid(req: express.Request, res: express.Response):void {
        let gridGenerator = new GridGenerator(Difficulty.easy);
        res.status(HttpStatus.OK);
        res.json(gridGenerator.gridGeneration());
        res.send();
    }
    
    @Route('get', '/normal')
    public getNormalGrid(req: express.Request, res: express.Response):void {
        let gridGenerator = new GridGenerator(Difficulty.normal);
        res.status(HttpStatus.OK);
        res.json(gridGenerator.gridGeneration());
        res.send();
    }
    
    @Route('get', '/hard')
    public getHardGrid(req: express.Request, res: express.Response):void {
        let gridGenerator = new GridGenerator(Difficulty.hard);
        res.status(HttpStatus.OK);
        res.json(gridGenerator.gridGeneration());
        res.send();
    }
}
