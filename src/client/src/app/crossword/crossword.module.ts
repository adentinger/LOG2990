import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrosswordComponent } from './crossword.component';
import { BoardComponent } from './board/board.component';
import { DefinitionFieldComponent } from './definition-field/definition-field.component';
import { ConfigMenuComponent } from './config-menu/config-menu.component';
import { GameDetailsComponent } from './game-details/game-details.component';
import { DefinitionComponent } from './definition-field/definition/definition.component';
import { PlayerInfoComponent } from './game-details/player-info/player-info.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        CrosswordComponent,
        BoardComponent,
        DefinitionFieldComponent,
        ConfigMenuComponent,
        GameDetailsComponent,
        DefinitionComponent,
        PlayerInfoComponent
    ],
    exports: [
        CrosswordComponent
    ]
})
export class CrosswordModule { }
