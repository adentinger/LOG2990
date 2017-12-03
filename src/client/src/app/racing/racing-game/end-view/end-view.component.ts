import { Component, Input, OnInit } from '@angular/core';

import 'rxjs/add/operator/switchMap';
import { RenderableMap } from '../racing-game-map/renderable-map';

@Component({
    selector: 'app-end-view',
    templateUrl: './end-view.component.html',
    styleUrls: ['./end-view.component.css']
})

export class EndViewComponent implements OnInit {

    @Input() public map: RenderableMap;
    public displayable;

    constructor() { }

    public ngOnInit(): void {
        this.displayable = false;
    }
}
