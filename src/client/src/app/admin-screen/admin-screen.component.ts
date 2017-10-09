import { Component, OnInit } from '@angular/core';
import { MapService } from '../racing/services/map.service';
import { SerializedMap } from './map-editor/serialized-map';
import { MapEditorComponent } from './map-editor/map-editor.component';

@Component({
    selector: 'app-admin-screen',
    templateUrl: './admin-screen.component.html',
    styleUrls: ['./admin-screen.component.css']
})
export class AdminScreenComponent implements OnInit {

    public mapNames: string[];
    public selectedMap: string;
    private child: MapEditorComponent;
    public serializedMap: SerializedMap;

    constructor(private mapService: MapService) { }

    public ngOnInit(): void {
        this.getMapsNames();
    }

    public getMapsNames(): void {
        this.mapService.getMapNames(100).then((mapNames) => this.mapNames = mapNames);
    }

    public mapSelected(map: string): void {
        this.selectedMap = map;
        this.mapService.getByName(this.selectedMap).then((serializedMap) => this.serializedMap = serializedMap);
    }

}
