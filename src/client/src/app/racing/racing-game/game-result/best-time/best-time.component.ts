import { Component, Input, OnInit } from '@angular/core';

import 'rxjs/add/operator/switchMap';
import { RenderableMap } from '../../racing-game-map/renderable-map';

@Component({
    selector: 'app-best-time',
    templateUrl: './best-time.component.html',
    styleUrls: ['./best-time.component.css']
})

export class BestTimeComponent implements OnInit {

    @Input() public map: RenderableMap;
    public displayable;

    constructor() { }

    public ngOnInit(): void {
        this.displayable = true;
    }
}

