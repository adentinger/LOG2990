import { GameMode } from '../../../../common/src/crossword/crossword-enums';
import { PlayerNumber, GameId } from '../../../../common/src/communication/game-configs';

export class GameData {

    constructor(public id: GameId,
                public playerName: string,
                public opponentName: string,
                public mode: GameMode,
                public numberOfPlayers: PlayerNumber) {}

}
