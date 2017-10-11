import { Component, OnInit, ElementRef, ViewChild, Input, AfterViewChecked } from '@angular/core';
import { MapEditorService } from '../../../admin-screen/map-editor/map-editor.service';
import { MapRendererService } from '../../../admin-screen/map-editor/map-renderer/map-renderer.service';
import { RacingUnitConversionService } from '../../../admin-screen/map-editor/racing-unit-conversion.service';
import { SerializedMap } from '../../../common/racing/serialized-map';

@Component({
    selector: 'app-map-thumbnail',
    templateUrl: './map-thumbnail.component.html',
    styleUrls: ['./map-thumbnail.component.css'],
    providers: [
        MapEditorService,
        MapRendererService,
        RacingUnitConversionService
    ]
})
export class MapThumbnailComponent implements OnInit, AfterViewChecked {

    @ViewChild('mapThumbnail') private mapThumbnail: ElementRef;

    public imageData: string;

    constructor(private mapEditor: MapEditorService,
                private mapRenderer: MapRendererService) { }

    public ngOnInit() {
        const CANVAS: HTMLCanvasElement = this.mapThumbnail.nativeElement;
        this.mapRenderer.canvas = CANVAS;

    }

    public ngAfterViewChecked(): void {
        this.mapRenderer.draw();
        setTimeout(() => this.imageData = this.canvasToImage(), 0);
    }

    public get width(): number {
        return this.mapEditor.mapWidth;
    }

    @Input() public set width(width: number) {
        this.mapEditor.mapWidth = width;
    }

    public get height(): number {
        return this.mapEditor.mapHeight;
    }

    @Input() public set height(height: number) {
        this.mapEditor.mapHeight = height;
    }

    @Input() public set map(serializedMap: SerializedMap) {
        this.mapEditor.deserializeMap(serializedMap);
        if (this.mapRenderer.canvas !== undefined) {
            this.mapRenderer.draw();
        }
    }

    private canvasToImage(): string {
        return this.mapRenderer.canvas.toDataURL();
    }

}
