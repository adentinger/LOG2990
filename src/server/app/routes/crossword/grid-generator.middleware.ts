import * as express from 'express';

import { Route, MiddleWare } from '../middle-ware';
import { HttpStatus } from '../../common/http-status';
import { GridGenerator } from './grid-generator/grid-generator';
import { DifficultyEasy } from './grid-generator/difficulty-easy';
import { DifficultyNormal } from './grid-generator/difficulty-normal';
import { DifficultyHard } from './grid-generator/difficulty-hard';
import { NormalWordSuggestionsGetter } from './grid-generator/normal-word-suggestions-getter';

@MiddleWare('/crossword/grid-generator')
export class GridGeneratorMiddleWare {

    @Route('get', '/easy')
    public async getEasyGrid(req: express.Request, res: express.Response): Promise<void> {
        res.json(await GridGenerator.getInstance()
                       .gridGeneration(
                           new NormalWordSuggestionsGetter(new DifficultyEasy())));
        res.status(HttpStatus.OK);
        res.send();
    }

    @Route('get', '/normal')
    public async getNormalGrid(req: express.Request, res: express.Response): Promise<void> {
        res.json(await GridGenerator.getInstance()
                       .gridGeneration(
                        new NormalWordSuggestionsGetter(new DifficultyNormal())));
        res.status(HttpStatus.OK);
        res.send();
    }

    @Route('get', '/hard')
    public async getHardGrid(req: express.Request, res: express.Response): Promise<void> {
        res.json(await GridGenerator.getInstance()
                       .gridGeneration(
                            new NormalWordSuggestionsGetter(new DifficultyHard())));
        res.status(HttpStatus.OK);
        res.send();
    }

}
