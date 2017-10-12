import * as express from 'express';
import { Route, MiddleWare } from '../middle-ware';
import { HttpStatus } from '../../http-response-status';
import { GameManager } from './games/game-manager';

type CrosswordGameMode = 'classic' | 'dynamic';
type CrosswordGameDifficulty = 'easy' | 'normal' | 'brutal';

interface MockCrosswordPendingGame {
    player: string;
    mode: CrosswordGameMode;
    difficulty: CrosswordGameDifficulty;
}

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

    // @Route('post', '/')
    // public postGame(req: express.Request, res: express.Response): void {
    //     // console.log('MIDDLEWARE TRIGGERED');
    //     // res.status(HttpStatus.ACCEPTED);

    //     console.log(req.body);
    //     const newGameId = GameManager.getInstance().newGame(req.body);
    //     res.send({
    //         'id': newGameId
    //     });
    // }
}
