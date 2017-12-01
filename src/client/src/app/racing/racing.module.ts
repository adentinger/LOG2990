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
import { LoaderService } from './racing-game/models/loader.service';

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
        MapThumbnailComponent,
        UIInputs
    ],
    providers: [
        MapService,
        RacingGameService,
        PhysicEngine,
        SoundService,
        CarsService,
        CarsProgressionService,
        LoaderService,
        { provide: TextureLoader, useValue: textureLoaderValue }
    ]
})
export class RacingModule { }
