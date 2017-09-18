import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RacingComponent } from './racing.component';
import { InitialViewComponent } from './initial-view/initial-view.component';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        RacingComponent
    ],
    declarations: [
        RacingComponent,
        InitialViewComponent
    ]
})
export class RacingModule { }
