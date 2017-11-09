import { GameMode, Difficulty } from '../../../../common/src/crossword/crossword-enums';
import { PlayerNumber, GameId } from '../../../../common/src/communication/game-configs';

export class GameData {

    constructor(public id: GameId = null,
                public playerName = 'Dylan Farvacque',
                public opponentName = 'CHUCK NORRIS',
                public mode = GameMode.Classic,
                public difficulty: Difficulty = Difficulty.hard,
                public numberOfPlayers: PlayerNumber = Math.PI) {}

    public clone(): GameData {
        return new GameData(
            this.id,
            this.playerName,
            this.opponentName,
            this.mode,
            this.numberOfPlayers
        );
    }

    public modeAsString(): string {
        switch (this.mode) {
            case GameMode.Classic: return 'Classic';
            case GameMode.Dynamic: return 'Dynamic';
            default: return '???';
        }
    }

    public difficultyAsString(): string {
        switch (this.difficulty) {
            case Difficulty.easy: return 'Easy';
            case Difficulty.medium: return 'Normal';
            case Difficulty.hard: return 'Hard';
            default: return '???';
        }
    }

}
