import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RacingComponent } from './racing.component';
import { InitialViewComponent } from './initial-view/initial-view.component';
import { MapService } from './services/map.service';
import { RacingGameComponent } from './racing-game/racing-game.component';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        RacingComponent
    ],
    declarations: [
        RacingComponent,
        InitialViewComponent,
        RacingGameComponent
    ],
    providers: [
        MapService
    ]
})
export class RacingModule { }
