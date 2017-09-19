import * as express from 'express';
import { Route } from '../middle-ware';

export class CrosswordGamesMiddleWare {
    @Route('get', '/crossword/games/pending/:count')
    public pending(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const mockPendingGames = [
            'MockPlayer0: Classic - Easy',
            'MockPlayer1: Dynamic - Normal',
            'MockPlayer2: Classic - BRUTAL',
            'MockPlayer3: Dynamic - Easy',
        ];
        res.send(mockPendingGames);
    }
}
