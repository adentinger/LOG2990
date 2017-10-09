import { Component, OnInit } from '@angular/core';
import { MapService } from '../racing/services/map.service';
import { Map as RacingMap} from './map-editor/map';

@Component({
    selector: 'app-admin-screen',
    templateUrl: './admin-screen.component.html',
    styleUrls: ['./admin-screen.component.css']
})
export class AdminScreenComponent implements OnInit {

    public displayable;
    public maps: RacingMap[];
    public selectedMap: RacingMap;

    constructor(private mapService: MapService) { }

    public ngOnInit(): void {
        this.getMaps();
    }


    public getMaps(): void {
        this.mapService.getMaps().then((maps) => this.maps = maps);
    }

    public mapSelected(map: RacingMap): void {
        this.selectedMap = map;
        this.displayable = true;
    }

}
