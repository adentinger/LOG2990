import { Injectable } from '@angular/core';

import { UserDisplayableGameData } from '../config-menu/available-games/user-displayable-game-data';

@Injectable()
export class GameService {

    constructor() { }

    public getGames(): Promise<UserDisplayableGameData[]> {
        return new Promise((resolve, reject) => resolve([]));
    }

}
