import { Component, OnInit } from '@angular/core';

import { MapService } from '../racing/services/map.service';
import { SerializedMap } from '../common/racing/serialized-map';
import { WordConstraint } from '../common/lexic/word-constraint';
import { PacketManagerService } from '../packet-manager.service';

@Component({
    selector: 'app-admin-screen',
    templateUrl: './admin-screen.component.html',
    styleUrls: ['./admin-screen.component.css']
})
export class AdminScreenComponent implements OnInit {
    public readonly JSON = JSON;
    public count = 0;

    public mapNames: string[];
    public selectedMap: string;
    public serializedMap: SerializedMap = new SerializedMap();

    constructor(private packetService: PacketManagerService,
        private mapService: MapService) { }

    public ngOnInit(): void {
        this.getMapsNames();
    }

    public get data() {
        return this.packetService.data;
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
            .catch(() => { });
    }

    public alertMapCouldNotBeSavedBecuaseAlreadyExists(): void {
        alert('Map could not be saved:\n' +
              'A map with that name already exists.');
    }

    public sendSocket(): void {
        const wc: WordConstraint = { minLength: ++this.count, isCommon: true, charConstraints: [{ char: 'a', position: 0 }] };
        console.log('[AdminScreen] Sending to server ...');
        this.packetService.packetManager.sendPacket(WordConstraint, wc);
    }

}
