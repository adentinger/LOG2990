import * as express from 'express';
import { Route, MiddleWare } from '../middle-ware';
import { HttpStatus } from '../../../../common/src/http-status';
import { GameManager } from './games/game-manager';
import { Logger } from '../../../../common/src';

type CrosswordGameMode = 'classic' | 'dynamic';
type CrosswordGameDifficulty = 'easy' | 'normal' | 'brutal';

interface MockCrosswordPendingGame {
    player: string;
    mode: CrosswordGameMode;
    difficulty: CrosswordGameDifficulty;
}

const logger = Logger.getLogger('CrosswordGamesMiddleWare');

@MiddleWare('/crossword/games')
export class CrosswordGamesMiddleWare {
    @Route('get', '/pending/:count')
    public pending(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const MODES: CrosswordGameMode[] = ['classic', 'dynamic'];
        const DIFFICULTIES: CrosswordGameDifficulty[] = ['easy', 'normal', 'brutal'];

        const NUMBER_GAMES_TO_GENERATE: number = req.params.count;
        const MOCK_PENDING_GAMES: MockCrosswordPendingGame[] = [];
        for (let i = 0; i < NUMBER_GAMES_TO_GENERATE; ++i) {
            MOCK_PENDING_GAMES.push({
                player: 'MockPlayer' + <Number>(i),
                mode: MODES[Math.round(Math.random() * (MODES.length - 1))],
                difficulty: DIFFICULTIES[Math.round(Math.random() * (DIFFICULTIES.length - 1))]
            });
        }
        res.send(MOCK_PENDING_GAMES);
    }

    @Route('post', '/')
    public postGame(req: express.Request, res: express.Response): void {
        res.status(HttpStatus.ACCEPTED);

        logger.log(req.body);
        const newGameId = GameManager.getInstance().newGame(req.body);
        res.json({
            'id': newGameId
        });
    }
    @Route('get', '/:id')
    public getGame(req: express.Request, res: express.Response): void {
        let game;
        try {
            game = GameManager.getInstance().getGame(req.params.id);
        } catch (error) {
            res.sendStatus(HttpStatus.NOT_FOUND);
            return;
        }
        res.status(HttpStatus.OK);
        res.send(game);
    }
}
