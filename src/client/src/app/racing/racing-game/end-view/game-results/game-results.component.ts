import { Component, Input, OnInit } from '@angular/core';

import 'rxjs/add/operator/switchMap';
import { RenderableMap } from '../../racing-game-map/renderable-map';

@Component({
    selector: 'app-game-results',
    templateUrl: './game-results.component.html',
    styleUrls: ['./game-results.component.css']
})

export class GameResultsComponent implements OnInit {

    @Input() public map: RenderableMap;
    public displayable;

    constructor() { }

    public ngOnInit(): void {
        this.displayable = false;
    }
}
