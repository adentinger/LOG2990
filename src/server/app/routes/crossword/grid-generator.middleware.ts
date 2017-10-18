import * as express from 'express';
import { Route, MiddleWare } from '../middle-ware';
import { HttpStatus } from '../../common/http-status';
import { GridGenerator } from './grid-generator/grid-generator';
import { DifficultyEasy } from './grid-generator/difficulty-easy';
import { DifficultyNormal } from './grid-generator/difficulty-normal';
import { DifficultyHard } from './grid-generator/difficulty-hard';

@MiddleWare('/crossword/grid-generator')
export class GridGeneratorMiddleWare {

    @Route('get', '/easy')
    public async getEasyGrid(req: express.Request, res: express.Response): Promise<void> {
        res.status(HttpStatus.OK);
        res.json(await GridGenerator.getInstance()
                       .gridGeneration(new DifficultyEasy));
        res.send();
    }

    @Route('get', '/normal')
    public async getNormalGrid(req: express.Request, res: express.Response): Promise<void> {
        res.status(HttpStatus.OK);
        res.json(await GridGenerator.getInstance()
                       .gridGeneration(new DifficultyNormal()));
        res.send();
    }

    @Route('get', '/hard')
    public async getHardGrid(req: express.Request, res: express.Response): Promise<void> {
        res.status(HttpStatus.OK);
        res.json(await GridGenerator.getInstance()
                       .gridGeneration(new DifficultyHard()));
        res.send();
    }

}
