import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RacingComponent } from './racing.component';
import { InitialViewComponent } from './initial-view/initial-view.component';
import { MapService } from './services/map.service';
import { RacingGameComponent } from './racing-game/racing-game.component';
import { MapBestTimeComponent } from './initial-view/map-best-time/map-best-time.component';
import { MapThumbnailComponent } from './initial-view/map-thumbnail/map-thumbnail.component';
import { UIInputs } from './services/ui-input.service';
import { RacingGameService } from './racing-game/racing-game.service';
import { PhysicEngine } from './racing-game/physic/engine';
import { SoundService } from './services/sound-service';
import { CarsService } from './racing-game/cars.service';
import { TextureLoader, textureLoaderValue } from './services/texture-loader';
import { CarsProgressionService } from './racing-game/cars-progression.service';
import { MapRatingComponent } from './racing-game/end-view/map-rating/map-rating.component';
import { BestTimeComponent } from './racing-game/end-view/best-time/best-time.component';
import { GameResultsComponent } from './racing-game/end-view/game-results/game-results.component';
import { EndViewComponent } from './racing-game/end-view/end-view.component';
import { EndViewService } from './services/end-view.service';
import { FormsModule } from '@angular/forms';


@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule
    ],
    exports: [
        RacingComponent
    ],
    declarations: [
        RacingComponent,
        InitialViewComponent,
        RacingGameComponent,
        MapBestTimeComponent,
        MapThumbnailComponent,
        MapRatingComponent,
        BestTimeComponent,
        GameResultsComponent,
        EndViewComponent,
        UIInputs
    ],
    providers: [
        MapService,
        RacingGameService,
        PhysicEngine,
        SoundService,
        CarsService,
        CarsProgressionService,
        EndViewService,
        { provide: TextureLoader, useValue: textureLoaderValue }
    ]
})
export class RacingModule { }
