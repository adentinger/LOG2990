import * as express from 'express';

import { MiddleWare, Route } from '../../middle-ware';
import { GameManager } from './game-manager';
import { CrosswordGameConfigs } from '../../../../../common/src/communication/game-configs';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Direction, Owner } from '../../../../../common/src/crossword/crossword-enums';

@MiddleWare('/crossword/games')
export class GamesMiddleWare {

    @Route('get', '/')
    public getGames(req: express.Request, res: express.Response): void {
        const configurations = GameManager.getInstance().getGameConfigurations();
        res.json(configurations);
    }

    @Route('post', '/')
    public postGame(req: express.Request, res: express.Response): void {
        const configuration: CrosswordGameConfigs = req.body;
        const gameId = GameManager.getInstance().newGame(configuration);
        res.json(gameId);
    }

    @Route('get', '/:id/words')
    public getWords(req: express.Request, res: express.Response): void {
        const gameId = req.params.id;
        console.log(gameId);
        res.json([
            new GridWord(1, 0, 0, 1, Direction.horizontal, Owner.none, 'a'),
            new GridWord(2, 0, 2, 1, Direction.horizontal, Owner.none, 'b'),
            new GridWord(1, 0, 3, 1, Direction.vertical,   Owner.none, 'c'),
            new GridWord(3, 0, 4, 1, Direction.horizontal, Owner.none, 'd'),
            new GridWord(2, 0, 5, 1, Direction.vertical,   Owner.none, 'e'),
        ]);
    }

}
