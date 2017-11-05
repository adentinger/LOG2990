import * as express from 'express';

import { MiddleWare, Route } from '../../middle-ware';
import { GameManager } from './game-manager';

@MiddleWare('/crossword/games')
export class GamesMiddleWare {

    @Route('get', '/')
    public getGames(req: express.Request, res: express.Response): void {
        const configurations = GameManager.getInstance().gamesConfigurations;
        res.json(configurations);
    }

}
