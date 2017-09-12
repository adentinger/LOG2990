export enum GameMode {
    'Unselected' = 0,
    'Classic',
    'Dynamic',
}
export enum PlayerNumber {
    'Unselected' = 0,
    'Single Player' = 1,
    'Two Players' = 2,
}
export enum DifficultyLevel {
    'Unselected' = 0,
    'Easy',
    'Normal',
    'Difficult',
}
export enum CreateJoin {
    'Unselected' = 0,
    'Create New Game',
    'Join Game'
}
export enum ConfigMenuState {
    ChooseMode         = 0,
    ChoosePlayerNumber = 1,
    ChooseCreateJoin   = 2,
    ChooseDifficulty   = 3,
    ChooseGameToJoin   = 4,
    ConfirmGame        = 5,
}
