import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { CrosswordComponent } from './crossword.component';
import { BoardComponent } from './board/board.component';
import { DefinitionFieldComponent } from './definition-field/definition-field.component';
import { ConfigMenuComponent } from './config-menu/config-menu.component';
import { GameDetailsComponent } from './game-details/game-details.component';
import { DefinitionComponent } from './definition-field/definition/definition.component';
import { PlayerInfoComponent } from './game-details/player-info/player-info.component';
import { FormsModule } from '@angular/forms';
import { ConfigMenuService, MENU_CONFIG_URL } from './config-menu/config-menu.service';
import { MENU_PAGES } from './config-menu/menu-pages';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule
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
        HttpClient,
        ConfigMenuService
    ],
    exports: [
        CrosswordComponent
    ]
})
export class CrosswordModule { }
