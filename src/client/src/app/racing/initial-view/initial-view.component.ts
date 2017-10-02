import { Component, OnInit } from '@angular/core';

import { MapService } from '../services/map.service';
import { Map } from '../../admin-screen/map-editor/map';

@Component({
    selector: 'app-initial-view',
    templateUrl: './initial-view.component.html',
    styleUrls: ['./initial-view.component.css']
})
export class InitialViewComponent implements OnInit {

    public maps: Map[];
    public selectedMap: Map;

    constructor(private mapService: MapService) { }

    public ngOnInit(): void {
        this.getMaps();
    }

    public getMaps(): void {
        this.mapService.getMaps().then(maps => this.maps = maps);
    }

    public mapSelected(map: Map): void {
        this.selectedMap = map;
        console.log('test');
    }

}
