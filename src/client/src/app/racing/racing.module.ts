import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RacingComponent } from './racing.component';
import { InitialViewComponent } from './initial-view/initial-view.component';
import { MapService } from './services/map.service';
import { RacingGameComponent } from './racing-game/racing-game.component';
import { MapBestTimeComponent } from './initial-view/map-best-time/map-best-time.component';
import { MapThumbnailComponent } from './initial-view/map-thumbnail/map-thumbnail.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    exports: [
        RacingComponent
    ],
    declarations: [
        RacingComponent,
        InitialViewComponent,
        RacingGameComponent,
        MapBestTimeComponent,
        MapThumbnailComponent
    ],
    providers: [
        MapService
    ]
})
export class RacingModule { }
