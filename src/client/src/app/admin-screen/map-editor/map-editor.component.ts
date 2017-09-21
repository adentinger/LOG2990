import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { MapEditorService } from './map-editor.service';
import { MapRendererService } from './map-renderer/map-renderer.service';
import { Point } from './point';
import { PointIndex } from './point-index';

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
    public isDragging = false;
    private hoveredPoint: PointIndex = -1;

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
                this.leftClick(event);
                break;
            }
            case RIGHT_MOUSE_BUTTON: {
                this.rightClick(event);
                break;
            }
        }
    }

    public mouseMoved(event: MouseEvent): void {
        const MOUSE_COORDINATES = new Point(event.offsetX, event.offsetY);

        if (this.isDragging) {
            this.mapEditor.editPoint(this.hoveredPoint, MOUSE_COORDINATES);
        }
        else {
            this.hoveredPoint = this.mapRenderer.activePoint;
        }

        this.mapRenderer.moveCursorTo(MOUSE_COORDINATES);
        this.mapRenderer.draw();
    }

    public mouseDown(): void {
        if (this.isHoveringPoint()) {
            this.isDragging = true;
        }
    }

    public mouseUp(): void {
        this.isDragging = false;
    }

    private isHoveringPoint(): boolean {
        return this.hoveredPoint >= 0;
    }

    private leftClick(event: MouseEvent): void {
        if (!this.isHoveringPoint()) {
            this.addPoint(event.offsetX, event.offsetY);
        }
    }

    private rightClick(event: MouseEvent): void {
        this.removePoint();
    }

    private addPoint(x: number, y: number): void {
        this.mapEditor.pushPoint(new Point(x, y));
        this.mapRenderer.draw();
    }

    private removePoint(): void {
        this.mapEditor.popPoint();
        this.mapRenderer.draw();
    }

}
