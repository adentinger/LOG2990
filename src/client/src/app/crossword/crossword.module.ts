import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrosswordComponent } from './components/crossword/crossword.component';
import { BoardComponent } from './components/crossword/board/board.component';
import { DefinitionFieldComponent } from './components/crossword/definition-field/definition-field.component';
import { ConfigMenuComponent } from './components/crossword/config-menu/config-menu.component';
import { GameDetailsComponent } from './components/crossword/game-details/game-details.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        CrosswordComponent,
        BoardComponent,
        DefinitionFieldComponent,
        ConfigMenuComponent,
        GameDetailsComponent
    ],
    exports: [
        CrosswordComponent
    ]
})
export class CrosswordModule {}
