import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RenderService } from './cube/render.service';
import { BasicService } from './basic.service';
import { Routes, RouterModule } from '@angular/router';

import { AppHeaderComponent } from './app-header/app-header.component';

import { AppComponent } from './app.component';
import { CubeComponent } from './cube/cube.component';

import { CrosswordModule } from './crossword/crossword.module';
import { RacingModule } from './racing/racing.module';

import { SelectionScreenComponent } from './selection-screen/selection-screen.component';
import { CrosswordComponent } from './crossword/components/crossword/crossword.component';
import { RacingComponent } from './racing/components/racing/racing.component';

const appRoutes: Routes = [
    { path: '', component: SelectionScreenComponent },
    { path: 'crossword', component: CrosswordComponent },
    { path: 'racing', component: RacingComponent },
];

@NgModule({
    declarations: [
        AppComponent,
        CubeComponent,
        SelectionScreenComponent,
        AppHeaderComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        CrosswordModule,
        RacingModule,
        RouterModule.forRoot(appRoutes)
    ],
    providers: [
        RenderService,
        BasicService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
