import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UserDisplayableGameData } from '../config-menu/available-games/user-displayable-game-data';
import { CrosswordGameConfigs, GameId } from '../../../../../common/src/communication/game-configs';

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
                        (config) => new UserDisplayableGameData(config.gameId, config.gameMode, config.difficulty)
                    );
                });
        return promise;
    }

    public requestGame(gameConfig: CrosswordGameConfigs): Promise<GameId> {
        const url = GameHttpService.BASE_URL;
        const promise =
            this.http.post<GameId>(url, gameConfig).toPromise();
        return promise;
    }

}
