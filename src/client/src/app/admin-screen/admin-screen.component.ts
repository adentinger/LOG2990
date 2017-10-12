import { Component, OnInit, OnDestroy } from '@angular/core';

import { MapService } from '../racing/services/map.service';
import { SerializedMap } from '../common/racing/serialized-map';
import { MapEditorComponent } from './map-editor/map-editor.component';
import { WordConstraint } from '../common/lexic/word-constraint';
import { PacketEvent } from '../common/communication/packet-api';
import { PacketManagerService } from '../packet-manager.service';
import { PacketHandler, Class } from '../common';
import { PacketManagerClient } from '../packet-manager-client';

@Component({
    selector: 'app-admin-screen',
    templateUrl: './admin-screen.component.html',
    styleUrls: ['./admin-screen.component.css']
})
export class AdminScreenComponent implements OnInit, OnDestroy {
    public readonly JSON = JSON;
    public count = 0;
    public data: any;
    private readonly packetHandlers: [Class<any>, PacketHandler<any>][] = [];

    public mapNames: string[];
    public selectedMap: string;
    private child: MapEditorComponent;
    public serializedMap: SerializedMap;

    constructor(private packetService: PacketManagerClient,
                private mapService: MapService) {}

    public ngOnInit(): void {
        this.getMapsNames();
        console.log('[AdminScreen] Registering handlers');
        this.packetHandlers.push([WordConstraint,
            this.packetService.registerHandler(WordConstraint, this.wordConstraintHandler.bind(this))]);
    }

    public ngOnDestroy(): void {
        console.log('[AdminScreen] Unregistering handlers');
        for (const [type, handler] of this.packetHandlers) {
            this.packetService.unregisterHandler(type, handler);
        }
    }

    public getMapsNames(): void {
        this.mapService.getMapNames(100).then((mapNames) => this.mapNames = mapNames);
    }

    public mapSelected(map: string): void {
        this.selectedMap = map;
        this.mapService.getByName(this.selectedMap).then((serializedMap) => this.serializedMap = serializedMap);
    }

    private keepAllMapsExcept(map: string): void {
        this.mapNames = this.mapNames.filter((name: string) => name !== map);
    }

    public addMap(map: string): void {
        this.keepAllMapsExcept(map);
        this.mapNames.push(map);
    }

    public deleteMap(map: string): void {
        this.mapService.delete(map)
            .then(() => this.keepAllMapsExcept(map))
            .catch(() => {});
    }

    private wordConstraintHandler(event: PacketEvent<WordConstraint>): void {
        console.log('[AdminScreen] Packet Received', JSON.stringify(event));
        this.data = event.value;
        console.log('[AdminScreen] data: ', this.data);
    }

    public sendSocket(): void {
        const wc: WordConstraint = { minLength: ++this.count, isCommon: true, charConstraints: [{ char: 'a', position: 0 }] };
        console.log('[AdminScreen] Sending to server ...');
        this.packetService.sendPacket(WordConstraint, wc);
    }

}
