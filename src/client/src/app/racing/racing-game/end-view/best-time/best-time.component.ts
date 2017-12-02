import { Component, Input, OnInit } from '@angular/core';
import { RenderableMap } from '../../racing-game-map/renderable-map';

@Component({
    selector: 'app-best-time',
    templateUrl: './best-time.component.html',
    styleUrls: ['./best-time.component.css']
})

export class BestTimeComponent implements OnInit {

    @Input() public map: RenderableMap;
    private isOnTopFive = true;

    constructor() { }

    public ngOnInit(): void {
    }

    private verifyIfOnTopFive(): void {

    }
}
