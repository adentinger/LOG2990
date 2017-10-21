import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppHeaderComponent } from './app-header/app-header.component';

import { AppComponent } from './app.component';

import { CrosswordModule } from './crossword/crossword.module';
import { RacingModule } from './racing/racing.module';

import { SelectionScreenComponent } from './selection-screen/selection-screen.component';

import { AdminScreenComponent } from './admin-screen/admin-screen.component';
import { MapEditorComponent } from './admin-screen/map-editor/map-editor.component';

import { AppRoutingModule } from './app-routing.module';

import { PacketManagerService, packetManagerClient } from './packet-manager.service';
import { PacketManagerClient } from './packet-manager-client';
import { MapService } from './racing/services/map.service';
import { AdminConfigComponent } from './admin-screen/admin-config/admin-config.component';
import { AdminConfigService } from './admin-screen/admin-config.service';
import { EventManager } from './event-manager.service';

@NgModule({
    declarations: [
        AppComponent,
        SelectionScreenComponent,
        AppHeaderComponent,
        AdminScreenComponent,
        MapEditorComponent,
        AdminConfigComponent,
    ],
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        CrosswordModule,
        RacingModule,
        AppRoutingModule
    ],
    providers: [
        PacketManagerService,
        {provide: PacketManagerClient, useValue: packetManagerClient},
        MapService,
        AdminConfigService,
        EventManager
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
