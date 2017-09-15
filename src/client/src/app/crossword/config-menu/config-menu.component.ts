import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { GameMode, PlayerNumber, DifficultyLevel, ConfigMenuState } from './enums';
import { MenuPage } from './menu-page';
import { ConfigMenuService } from './config-menu.service';
import { MENU_PAGES } from './menu-pages';

class CrosswordGameConfiguration {
    public gameMode: GameMode = GameMode.Unselected;
    public playerNumber: PlayerNumber = PlayerNumber.Unselected;
    public difficultyLevel: DifficultyLevel = DifficultyLevel.Unselected;
}

@Component({
    selector: 'app-config-menu',
    templateUrl: './config-menu.component.html',
    styleUrls: ['./config-menu.component.css'],
    providers: [
        ConfigMenuService,
        {provide: 'menuPages', useValue: MENU_PAGES}
    ]
})
export class ConfigMenuComponent implements OnInit {
    public config: CrosswordGameConfiguration = new CrosswordGameConfiguration;
    public states: ConfigMenuState[] = [ConfigMenuState.ChooseMode];
    public menuPages: MenuPage[];
    public none: HTMLDivElement;

    constructor(private location: Location, private configMenuService: ConfigMenuService) {
        this.menuPages = [
            {
                id: ConfigMenuState.ChooseMode,
                title: 'Choose a game mode:',
                options: [
                    {
                        name: 'Classique',
                        clickHandler: () => this.chooseGameMode(1)
                    },
                    {
                        name: 'Dynamic',
                        clickHandler: () => this.chooseGameMode(2)
                    },
                    {
                        name: 'Back to Main Page',
                        clickHandler: () => this.location.back()
                    }
                ]
            },
            {
                id: ConfigMenuState.ChoosePlayerNumber,
                title: '',
                options: [
                    {
                        name: 'Single Player',
                        clickHandler: () => this.choosePlayerNumber(1)
                    },
                    {
                        name: 'Two Players',
                        clickHandler: () => this.choosePlayerNumber(2)
                    },
                    {
                        name: 'Back',
                        clickHandler: () => this.stateBack()
                    }
                ]
            },
            {
                id: ConfigMenuState.ChooseCreateJoin,
                title: 'Two Players',
                options: [
                    {
                        name: 'Create New Game',
                        clickHandler: () => this.chooseCreateJoin(1)
                    },
                    {
                        name: 'Join Game',
                        clickHandler: () => this.chooseCreateJoin(2)
                    },
                    {
                        name: 'Back',
                        clickHandler: () => this.stateBack()
                    }
                ]
            },
            {
                id: ConfigMenuState.ChooseDifficulty,
                title: '',
                options: [
                    {
                        name: 'Easy',
                        clickHandler: () => this.chooseDifficulty(1)
                    },
                    {
                        name: 'Normal',
                        clickHandler: () => this.chooseDifficulty(2)
                    },
                    {
                        name: 'BRUTAL',
                        clickHandler: () => this.chooseDifficulty(3)
                    },
                    {
                        name: 'Back',
                        clickHandler: () => this.stateBack()
                    }
                ]
            },
            {
                id: ConfigMenuState.ChooseGameToJoin,
                title: 'Available Games',
                options: [
                    {
                        name: 'Back',
                        clickHandler: () => this.stateBack()
                    }
                ]
            },
            {
                id: ConfigMenuState.ConfirmGame,
                title: 'Accept these settings ?',
                description: () => {
                    let constructedDescription = '<ul>';
                    constructedDescription += `<li>Game Mode: ${GameMode[this.config.gameMode]}</li>`;
                    constructedDescription += `<li>Player Mode: ${PlayerNumber[this.config.playerNumber]}</li>`;
                    constructedDescription += `<li>Difficulty: ${DifficultyLevel[this.config.difficultyLevel]}</li>`;
                    constructedDescription += '</ul>';
                    return constructedDescription;
                },
                options: [
                    {
                        name: 'Start',
                        clickHandler: () => this.sendConfigToServer()
                    },
                    {
                        name: 'Back',
                        clickHandler: () => this.stateBack()
                    }
                ]
            }
        ];
        const playerPagePredicate = (page) => page.id === ConfigMenuState.ChoosePlayerNumber;
        const difficultyPagePredicate = (page) => page.id === ConfigMenuState.ChooseDifficulty;
        Object.defineProperty(this.menuPages.find(playerPagePredicate), 'title', {
            get: () => GameMode[this.config.gameMode]
        });
        Object.defineProperty(this.menuPages.find(difficultyPagePredicate), 'title', {
            get: () => PlayerNumber[this.config.playerNumber]
        });
    }
    public ngOnInit() {
    }

    public stateBack() {
        if (this.states.length > 1) {
            this.states.pop();
        }
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
            this.states.push(ConfigMenuState.ChooseCreateJoin);
        }
    }
    public chooseDifficulty(difficulty: number) {
        this.config.difficultyLevel = difficulty as DifficultyLevel;
        this.states.push(ConfigMenuState.ConfirmGame);
    }
    public chooseCreateJoin(choice: number) {
        //
        if (choice === 1) {
            this.states.push(ConfigMenuState.ChooseDifficulty);
        } else {
            this.states.push(ConfigMenuState.ChooseGameToJoin);
        }
    }
    public chooseGameToJoin(choice: number) {

    }
    public sendConfigToServer(): void {

    }

    public getDescription(object: string | (() => string)): string {
        if (typeof(object) === 'string') {
            return object as string;
        }
        return (object as (() => string))();
    }

}
