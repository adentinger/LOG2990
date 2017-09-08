import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrosswordComponent } from './components/crossword/crossword.component';
import { BoardComponent } from './components/crossword/board/board.component';
import { DefinitionFieldComponent } from './components/crossword/definition-field/definition-field.component';
import { ConfigMenuComponent } from './components/crossword/config-menu/config-menu.component';
import { GameDetailsComponent } from './components/crossword/game-details/game-details.component';
import { DefinitionComponent } from './components/crossword/definition-field/definition/definition.component';
import { PlayerInfoComponent } from './components/crossword/game-details/player-info/player-info.component';

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
export class CrosswordModule {}
