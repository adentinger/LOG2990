import * as express from 'express';

import { MiddleWare, Route } from '../../middle-ware';
import { GameManager } from './game-manager';
import { CrosswordGameConfigs } from '../../../../../common/src/communication/game-configs';

@MiddleWare('/crossword/games')
export class GamesMiddleWare {

    @Route('get', '/')
    public getGames(req: express.Request, res: express.Response): void {
        const configurations = GameManager.getInstance().gamesConfigurations;
        res.json(configurations);
    }

    @Route('post', '/')
    public postGame(req: express.Request, res: express.Response): void {
        const configuration: CrosswordGameConfigs = req.body;
        const gameId = GameManager.getInstance().newGame(configuration);
        res.json(gameId);
    }

}
