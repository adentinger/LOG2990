import { Component, Input, OnInit } from '@angular/core';

import 'rxjs/add/operator/switchMap';

import { SerializedMap } from '../../../../../../common/src/racing/serialized-map';

@Component({
    selector: 'app-map-best-time',
    templateUrl: './map-best-time.component.html',
    styleUrls: ['./map-best-time.component.css']
})

export class MapBestTimeComponent implements OnInit {
    @Input() public map: SerializedMap;
    public displayable;

    constructor() { }

    public ngOnInit(): void {
        this.displayable = true;
    }
}
