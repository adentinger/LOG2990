import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectionScreenComponent } from './selection-screen/selection-screen.component';
import { CrosswordComponent } from './crossword/crossword.component';
import { RacingComponent } from './racing/racing.component';
import { RacingGameComponent } from './racing/racing-game/racing-game.component';

import { AdminScreenComponent } from './admin-screen/admin-screen.component';
import { MapEditorComponent } from './admin-screen/map-editor/map-editor.component';

const routes: Routes = [
    { path: 'admin/map-editor' , component: MapEditorComponent},
    { path: 'admin', component: AdminScreenComponent},
    { path: '', component: SelectionScreenComponent },
    { path: 'crossword', component: CrosswordComponent },
    { path: 'racing', component: RacingComponent },
    { path: 'racing/racing-game', component: RacingGameComponent}
  ];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
  })
  export class AppRoutingModule {}
