import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { MapEditorService } from './map-editor.service';
import { MapRendererService } from './map-renderer/map-renderer.service';
import { Point } from './point';

const LEFT_MOUSE_BUTTON = 0;
const RIGHT_MOUSE_BUTTON = 2;

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

    public clicked(event: MouseEvent): void {
        event.preventDefault();
        switch (event.button) {
            case LEFT_MOUSE_BUTTON: {
                this.addPoint(event.offsetX, event.offsetY);
                break;
            }
            case RIGHT_MOUSE_BUTTON: {
                this.removePoint();
                break;
            }
        }
    }

    private addPoint(x: number, y: number): void {
        this.mapEditor.pushPoint(new Point(x, y));
        this.mapRenderer.draw();
    }

    private removePoint(): void {
        this.mapEditor.popPoint();
        this.mapRenderer.draw();
    }

    public mouseMoved(event: MouseEvent): void {
        const COORDINATES = new Point(event.offsetX, event.offsetY);
        this.mapRenderer.moveCursorTo(COORDINATES);
        this.mapRenderer.draw();
    }
}
