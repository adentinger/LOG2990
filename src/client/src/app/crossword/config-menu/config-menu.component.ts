import { Component, OnInit } from '@angular/core';

enum GameMode {
    Unselected = 0,
    Classic,
    Dynamic,
}
enum PlayerNumber {
    Unselected = 0,
    SinglePlayer = 1,
    TwoPlayers = 2,
}
enum DifficultyLevel {
    Unselected = 0,
    Easy,
    Normal,
    Difficult,
}
class CrosswordGameConfiguration {
    public gameMode: GameMode = GameMode.Unselected;
    public playerNumber: PlayerNumber = PlayerNumber.Unselected;
    public difficultyLevel: DifficultyLevel = DifficultyLevel.Unselected;
}
enum ConfigMenuState {
    ChooseMode         = 0,
    ChoosePlayerNumber = 1,
    ChooseDifficulty   = 2,
    ChooseCreateJoin   = 3,
    ChooseGameToJoin   = 4,
    ConfirmGame        = 5,
}

@Component({
    selector: 'app-config-menu',
    templateUrl: './config-menu.component.html',
    styleUrls: ['./config-menu.component.css']
})
export class ConfigMenuComponent implements OnInit {
    public config: CrosswordGameConfiguration = new CrosswordGameConfiguration;
    public states: ConfigMenuState[] = [ConfigMenuState.ChooseMode];

    constructor() {

    }
    public ngOnInit() {
    }
    public chooseGameMode(gameMode: number) {
        this.config.gameMode = gameMode as GameMode;
        this.states.push(ConfigMenuState.ChoosePlayerNumber);
    }
    public choosePlayerNumber(playerNumber: number) {
        this.config.playerNumber = playerNumber as PlayerNumber;
        if (playerNumber === 1) {
            this.states.push(ConfigMenuState.ChooseDifficulty);
        } else {
            this.states.push(ConfigMenuState.ChooseGameToJoin);
        }
    }
    public chooseDifficulty(difficulty: number) {
        this.config.difficultyLevel = difficulty as DifficultyLevel;
        this.states.push(ConfigMenuState.ConfirmGame);
    }
    public chooseCreateJoin(choice: number) {

    }
    public chooseGameToJoin(choice: number) {

    }
    public sendConfigToServer(): void {

    }

}
