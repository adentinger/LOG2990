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

    @Input() public name;
    private isOnTopFive = true;
    constructor(private endViewService: EndViewService,
    private zone: NgZone) {
        this.name = '';
    }

    public reloadPage(): void {
        this.zone.runOutsideAngular(() => location.reload());
    }
}
