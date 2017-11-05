import { CrosswordGameConfigs, GameId } from '../../../../../../common/src/communication/game-configs';
import { GameMode, Difficulty } from '../../../../../../common/src/crossword/crossword-enums';

/**
 * @class UserDisplayableGameData
 * @description Contains the data of a game as text so that it can be
 * displayed to the user.
 */
export class UserDisplayableGameData {

    private idInternal: string;
    private modeInternal: string;
    private difficultyInternal: string;

    constructor(gameId: GameId, gameMode: GameMode, difficulty: Difficulty) {
        this.idInternal = this.deserializeGameId(gameId);
        this.modeInternal = this.deserializeGameMode(gameMode);
        this.difficultyInternal = this.deserializeDifficulty(difficulty);
    }

    public get id(): string {
        return this.idInternal;
    }

    public get mode(): string {
        return this.modeInternal;
    }

    public get difficulty(): string {
        return this.difficultyInternal;
    }

    private deserializeGameId(gameId: GameId): string {
        return gameId.toString();
    }

    private deserializeGameMode(gameMode: GameMode): string {
        switch (gameMode) {
            case GameMode.Classic: return 'Classic';
            case GameMode.Dynamic: return 'Dynamic';
            default: throw new Error(`Game mode ${gameMode} invalid`);
        }
    }

    private deserializeDifficulty(difficulty: Difficulty): string {
        switch (difficulty) {
            case Difficulty.easy: return 'Easy';
            case Difficulty.medium: return 'Normal';
            case Difficulty.hard: return 'Hard';
            default: throw new Error(`Difficulty ${difficulty} invalid`);
        }
    }

}
