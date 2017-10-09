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

    public maps: SerializedMap[];
    public selectedMap: SerializedMap;
    private child: MapEditorComponent;

    constructor(private mapService: MapService) { }

    public ngOnInit(): void {
        this.getMaps();
    }

    public getMaps(): void {
        this.mapService.getMaps().then((maps) => this.maps = maps);
    }

    public mapSelected(map: SerializedMap): void {
        this.selectedMap = map;
    }

}
