import * as express from 'express';
import { Route, MiddleWare } from '../middle-ware';
import { HttpStatus } from '../../common/http-status';
import { GridGenerator } from './grid-generator/grid-generator';
import { Difficulty } from './grid-generator/grid';

@MiddleWare('/crossword/grid-generator')
export class GridGeneratorMiddleWare {

    @Route('get', '/easy')
    public async getEasyGrid(req: express.Request, res: express.Response): Promise<void> {
        const GRID_GENERATOR = new GridGenerator(Difficulty.easy);
        res.status(HttpStatus.OK);
        res.json(await GRID_GENERATOR.gridGeneration());
        res.send();
    }

    @Route('get', '/normal')
    public async getNormalGrid(req: express.Request, res: express.Response): Promise<void> {
        const GRID_GENERATOR = new GridGenerator(Difficulty.normal);
        res.status(HttpStatus.OK);
        res.json(await GRID_GENERATOR.gridGeneration());
        res.send();
    }

    @Route('get', '/hard')
    public async getHardGrid(req: express.Request, res: express.Response): Promise<void> {
        const GRID_GENERATOR = new GridGenerator(Difficulty.hard);
        res.status(HttpStatus.OK);
        res.json(await GRID_GENERATOR.gridGeneration());
        res.send();
    }

}
