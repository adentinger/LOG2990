import * as express from 'express';

import { MiddleWare, Route } from '../middle-ware';
import { GridBanks } from './grid-bank/grid-banks';
import { HttpStatus, getStatusOrDefault } from '../../common/http-status';
import { Grid } from '../../common/grid';

@MiddleWare('/crossword/grid-bank')
export class GridBankMiddleWare {

    private static getGrid(gridGetter: () => Promise<Grid>,
        res: express.Response): void {
        gridGetter()
            .then((grid) => {
                res.status(HttpStatus.OK);
                res.json(grid);
            })
            .catch((reason: any) => {
                res.sendStatus(getStatusOrDefault(reason));
            });
    }

    @Route('post', '/fillup')
    public postFillup(req: express.Request, res: express.Response): void {
        GridBanks.getInstance().fillup()
            .then(() => res.sendStatus(HttpStatus.OK))
            .catch((reason: any) => {
                res.sendStatus(getStatusOrDefault(reason));
            });
    }

    @Route('get', '/easy')
    public getEasy(req: express.Request, res: express.Response): void {
        GridBankMiddleWare
            .getGrid(GridBanks.getInstance().getEasyGrid, res);
    }

    @Route('get', '/normal')
    public getNormal(req: express.Request, res: express.Response): void {
        GridBankMiddleWare
            .getGrid(GridBanks.getInstance().getNormalGrid, res);
    }

    @Route('get', '/hard')
    public getHard(req: express.Request, res: express.Response): void {
        GridBankMiddleWare
            .getGrid(GridBanks.getInstance().getHardGrid, res);
    }

}
