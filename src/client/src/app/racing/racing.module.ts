import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RacingComponent } from './racing.component';
import { InitialViewComponent } from './initial-view/initial-view.component';
import { MapService } from './services/map.service';
import { MapBestTimeComponent } from './initial-view/map-best-time/map-best-time.component';

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
        MapBestTimeComponent
    ],
    providers: [
        MapService
    ]
})
export class RacingModule { }
