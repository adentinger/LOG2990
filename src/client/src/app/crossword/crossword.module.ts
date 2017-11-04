import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CrosswordComponent } from './crossword.component';
import { BoardComponent } from './board/board.component';
import { DefinitionFieldComponent } from './definition-field/definition-field.component';
import { GameDetailsComponent } from './game-details/game-details.component';
import { SimpleTimer } from 'ng2-simple-timer';
import { DefinitionsService } from './definition-field/definitions.service';
import { ClickOutsideModule } from 'ng-click-outside';
import { CrosswordGameService } from './crossword-game.service';
import { CrosswordTileComponent } from './board/crossword-tile/crossword-tile.component';
import { CrosswordGridService } from './board/crossword-grid.service';
import { GameDetailsService } from './game-details/game-details.service';
import { SelectionService } from './selection.service';
import { CheatModeComponent } from './cheat-mode/cheat-mode.component';
import { ConfigMenuComponent } from './config-menu/config-menu.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        ClickOutsideModule,
        RouterModule
    ],
    declarations: [
        CrosswordComponent,
        BoardComponent,
        DefinitionFieldComponent,
        GameDetailsComponent,
        CrosswordTileComponent,
        CheatModeComponent,
        ConfigMenuComponent,
    ],
    providers: [
        HttpClient,
        SimpleTimer,
        DefinitionsService,
        CrosswordGameService,
        CrosswordGridService,
        GameDetailsService,
        SelectionService
    ],
    exports: [
        CrosswordComponent
    ]
})
export class CrosswordModule { }


