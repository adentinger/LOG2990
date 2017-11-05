import { CrosswordGameConfigs, PlayerNumber } from '../../../../../common/src/communication/game-configs';
import { Difficulty, GameMode, CreateOrJoin } from '../../../../../common/src/crossword/crossword-enums';

export function createMockGameConfigs(): CrosswordGameConfigs {
    const gameModes = [GameMode.Classic, GameMode.Dynamic];
    const playerNumbers: PlayerNumber[] = [1, 2];
    const createJoinChoices = [CreateOrJoin.create, CreateOrJoin.join];
    const difficulties = [Difficulty.easy, Difficulty.medium, Difficulty.hard];

    const randGameMode = gameModes[Math.floor(Math.random() * gameModes.length)];
    const randPlayerNumber = playerNumbers[Math.floor(Math.random() * playerNumbers.length)];
    const randCreateJoin = createJoinChoices[Math.floor(Math.random() * createJoinChoices.length)];
    const randDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];

    const config: CrosswordGameConfigs = {
        gameMode: randGameMode,
        playerNumber: randPlayerNumber,
        createJoin: randCreateJoin,
        difficulty: randDifficulty,
        gameId: -1
    };
    return config;
}
