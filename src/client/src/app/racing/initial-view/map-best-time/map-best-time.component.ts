import { Component, Input } from '@angular/core';

import { MapService } from '../../services/map.service';
import { Map } from '../../../admin-screen/map-editor/map';

@Component({
    selector: 'app-map-best-time',
    templateUrl: './map-best-time.component.html',
    styleUrls: ['./map-best-time.component.css']
})

export class mapBestTimeComponent {
    @Input() map: Map;
}
