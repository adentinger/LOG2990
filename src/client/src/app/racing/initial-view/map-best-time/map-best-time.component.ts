import { Component, Input, OnInit } from '@angular/core';

import { MapService } from '../../services/map.service';
import { Map } from '../../../admin-screen/map-editor/map';

@Component({
    selector: 'app-map-best-time',
    templateUrl: './map-best-time.component.html',
    styleUrls: ['./map-best-time.component.css']
})

export class MapBestTimeComponent implements OnInit {
    @Input() public map: Map;
    public displayable;

    public ngOnInit(): void {
        this.displayable = true;
    }
}
