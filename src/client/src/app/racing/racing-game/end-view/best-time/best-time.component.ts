import { Component, Input, OnInit } from '@angular/core';
import { RenderableMap } from '../../racing-game-map/renderable-map';
import { EndViewService } from '../../../services/end-view.service';

@Component({
    selector: 'app-best-time',
    templateUrl: './best-time.component.html',
    styleUrls: ['./best-time.component.css']
})

export class BestTimeComponent {

    constructor(private endViewService: EndViewService) { }
}
