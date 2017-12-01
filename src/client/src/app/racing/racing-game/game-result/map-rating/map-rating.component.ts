import { Component, Input, OnInit } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { RenderableMap } from '../../racing-game-map/renderable-map';

@Component({
    selector: 'app-map-rating',
    templateUrl: './map-rating.component.html',
    styleUrls: ['./map-rating.component.css']
})

export class MapRatingComponent implements OnInit {

    @Input() public map: RenderableMap;
    public displayable;

    constructor() { }

    public ngOnInit(): void {
        this.displayable = true;
    }
}

