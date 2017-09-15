import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrosswordComponent } from './crossword.component';
import { BoardComponent } from './board/board.component';
import { DefinitionFieldComponent } from './definition-field/definition-field.component';
import { ConfigMenuComponent } from './config-menu/config-menu.component';
import { GameDetailsComponent } from './game-details/game-details.component';
import { DefinitionComponent } from './definition-field/definition/definition.component';
import { PlayerInfoComponent } from './game-details/player-info/player-info.component';
import { FormsModule } from '@angular/forms';
import { ConfigMenuService } from './config-menu/config-menu.service';
import { MENU_PAGES } from './config-menu/menu-pages';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
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
    providers: [
        ConfigMenuService,
        {provide: 'menuPages', useValue: MENU_PAGES}
    ],
    exports: [
        CrosswordComponent
    ]
})
export class CrosswordModule { }
