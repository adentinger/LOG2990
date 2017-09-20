import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { CrosswordComponent } from './crossword.component';
import { BoardComponent } from './board/board.component';
import { DefinitionFieldComponent } from './definition-field/definition-field.component';
import { ConfigMenuComponent } from './config-menu/config-menu.component';
import { GameDetailsComponent } from './game-details/game-details.component';
import { PlayerInfoComponent } from './game-details/player-info/player-info.component';
import { FormsModule } from '@angular/forms';
import { ConfigMenuService } from './config-menu/config-menu.service';
import { SimpleTimer } from 'ng2-simple-timer';

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
        PlayerInfoComponent,
    ],
    providers: [
        HttpClient,
        ConfigMenuService,
        SimpleTimer,
    ],
    exports: [
        CrosswordComponent
    ]
})
export class CrosswordModule { }
