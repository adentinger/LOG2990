import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { MapEditorService } from './map-editor.service';
import { MapRendererService } from './map-renderer/map-renderer.service';
import { Point } from './point';

@Component({
    selector: 'app-map-editor',
    templateUrl: './map-editor.component.html',
    styleUrls: ['./map-editor.component.css'],
    providers: [MapEditorService, MapRendererService]
})
export class MapEditorComponent implements OnInit {
    @ViewChild('editingArea') private editingArea: ElementRef;

    public width = 500;
    public height = 500;

    constructor(private mapEditor: MapEditorService,
                private mapRenderer: MapRendererService) { }

    public ngOnInit(): void {
        const CANVAS: HTMLCanvasElement = this.editingArea.nativeElement;
        this.mapRenderer.canvas = CANVAS;
    }

    public addPoint(event: MouseEvent): void {
        this.mapEditor.pushPoint(new Point(event.offsetX, event.offsetY));
        this.mapRenderer.draw();
    }

    public undoLastPoint(): void {
        this.mapEditor.popPoint();
        this.mapRenderer.draw();
    }

    public mouseMoved(event: MouseEvent): void {
        this.mapRenderer.draw();
    }
}
