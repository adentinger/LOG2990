import { Component, Input, OnInit, NgZone } from '@angular/core';
import { RenderableMap } from '../../racing-game-map/renderable-map';
import { EndViewService } from '../../../services/end-view.service';
import 'rxjs/add/operator/switch';


@Component({
    selector: 'app-best-time',
    templateUrl: './best-time.component.html',
    styleUrls: ['./best-time.component.css']
})

export class BestTimeComponent {

    @Input() private userName;
    private inscribeButton = false;
    constructor(private endViewService: EndViewService,
    private zone: NgZone) {
    }

    private reloadPage(): void {
        this.zone.runOutsideAngular(() => location.reload());
    }

    private inscribeOnMapBestTimes(): void {
        this.endViewService.updateMapBestTime(this.userName);
        this.inscribeButton = true;
    }
}
