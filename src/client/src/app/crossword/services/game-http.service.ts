import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UserDisplayableGameData } from '../config-menu/available-games/user-displayable-game-data';
import { CrosswordGameConfigs, GameId } from '../../../../../common/src/communication/game-configs';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Direction, Owner } from '../../../../../common/crossword/crossword-enums';

@Injectable()
export class GameHttpService {

    private static readonly BASE_URL = 'http://localhost:3000/crossword/games';

    constructor(private http: HttpClient) { }

    public getGames(): Promise<UserDisplayableGameData[]> {
        const url = GameHttpService.BASE_URL;
        const promise =
            this.http.get<CrosswordGameConfigs[]>(url).toPromise()
                .then((configs) => {
                    const twoPlayerGames = configs.filter((config) => config.playerNumber === 2);
                    return twoPlayerGames.map(
                        (config) => new UserDisplayableGameData(
                            config.playerName,
                            config.gameId,
                            config.gameMode,
                            config.difficulty
                        )
                    );
                });
        return promise;
    }

    public createGame(gameConfig: CrosswordGameConfigs): Promise<GameId> {
        const url = GameHttpService.BASE_URL;
        const promise =
            this.http.post<GameId>(url, gameConfig).toPromise();
        return promise;
    }

    public getWords(): Promise<GridWord[]> {
        return new Promise((resolve, reject) => {
            resolve([
                new GridWord(1, 0, 0, 1, Direction.horizontal, Owner.none, 'a'),
                new GridWord(2, 0, 2, 1, Direction.horizontal, Owner.none, 'b'),
                new GridWord(1, 0, 3, 1, Direction.vertical, Owner.none, 'c'),
                new GridWord(3, 0, 4, 1, Direction.horizontal, Owner.none, 'd'),
                new GridWord(2, 0, 5, 1, Direction.vertical, Owner.none, 'e'),
            ]);
        });
    }

}
