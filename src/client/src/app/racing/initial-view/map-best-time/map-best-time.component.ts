import { Component, Input, OnInit } from '@angular/core';

import { MapService } from '../../services/map.service';
import { Map } from '../../../admin-screen/map-editor/map';

@Component({
    selector: 'app-map-best-time',
    templateUrl: './map-best-time.component.html',
    styleUrls: ['./map-best-time.component.css']
})

export class mapBestTimeComponent implements OnInit {
    @Input() public map: Map;
    @Input() public displayable;
    public set(): void {
        this.displayable = true;
    }

    public ngOnInit(): void {
        this.displayable = true;
        console.log('hey');
    }
}
