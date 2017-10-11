import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { MapService } from '../services/map.service';
import { SerializedMap } from '../../common/racing/serialized-map';
import { MapBestTimeComponent } from './map-best-time/map-best-time.component';
import { MapThumbnailComponent} from './map-thumbnail/map-thumbnail.component';
import { MapEditorService } from '../../admin-screen/map-editor/map-editor.service';
import { MapRendererService } from '../../admin-screen/map-editor/map-renderer/map-renderer.service';
import { RacingUnitConversionService } from '../../admin-screen/map-editor/racing-unit-conversion.service';

@Component({
    selector: 'app-initial-view',
    templateUrl: './initial-view.component.html',
    styleUrls: ['./initial-view.component.css'],
})
export class InitialViewComponent implements OnInit {

    @ViewChild(MapBestTimeComponent)
    private child: MapBestTimeComponent;
    public maps: SerializedMap[];
    public selectedMap: SerializedMap;

    public width: number;
    public height: number;

    constructor(private mapService: MapService) { }

    public ngOnInit(): void {
        this.getMaps();
    }

    public getMaps(): void {
        this.mapService.getMaps().then(maps => this.maps = maps);
    }

    public mapSelected(map: SerializedMap): void {
        this.selectedMap = map;
        this.child.displayable = true;
    }

    public get mapWidth(): number {
        return this.width;
    }

    @Input() public set mapWidth(width: number) {
        this.width = width;
    }

    @Input() public set mapHeight(height: number) {
        this.height = height;
    }

}
