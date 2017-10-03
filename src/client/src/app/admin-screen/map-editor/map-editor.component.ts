import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';

import { MapEditorService } from './map-editor.service';
import { MapRendererService } from './map-renderer/map-renderer.service';
import { RacingUnitConversionService } from './racing-unit-conversion.service';
import { Map as RacingMap, MAP_TYPES, MapError } from './map';
import { Point } from './point';
import { PointIndex } from './point-index';

const LEFT_MOUSE_BUTTON = 0;
const RIGHT_MOUSE_BUTTON = 2;

const INITIAL_WIDTH = 500;

@Component({
    selector: 'app-map-editor',
    templateUrl: './map-editor.component.html',
    styleUrls: ['./map-editor.component.css'],
    providers: [
        MapEditorService,
        MapRendererService,
        RacingUnitConversionService
    ]
})
export class MapEditorComponent implements OnInit {
    @ViewChild('editingArea') private editingArea: ElementRef;

    @Input() public set width(width: number) {
        this.mapEditor.mapWidth = width;
    }

    public isDragging = false;
    private isMouseDown = false;
    private hoveredPoint: PointIndex = -1;

    constructor(private mapEditor: MapEditorService,
                private mapRenderer: MapRendererService) {
        this.width = INITIAL_WIDTH;
    }

    public ngOnInit(): void {
        const CANVAS: HTMLCanvasElement = this.editingArea.nativeElement;
        this.mapRenderer.canvas = CANVAS;
    }

    public get mapTypes(): string[] {
        return  MAP_TYPES;
    }
    public get currentMap(): RacingMap {
        return this.mapEditor.currentMap;
    }

    public get isMapValid(): boolean {
        return this.mapEditor.computeMapErrors() === MapError.NONE;
    }

    public saveMap(): void {
        console.log('Map "Saved": ', this.mapEditor.serializeMap());
    }

    public clicked(event: MouseEvent): void {
        event.preventDefault();
        if (!this.isDragging) {
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
        else {
            this.isDragging = false;
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

        if (this.isMouseDown && this.isHoveringPoint()) {
            this.isDragging = true;
        }

        this.mapRenderer.moveCursorTo(MOUSE_COORDINATES);
        this.mapRenderer.draw();
    }

    public mouseDown(): void {
        this.isMouseDown = true;
    }

    public mouseUp(event: MouseEvent): void {
        this.isMouseDown = false;
    }

    private isHoveringPoint(): boolean {
        return this.hoveredPoint >= 0;
    }

    private leftClick(event: MouseEvent): void {
        if (!this.isHoveringPoint()) {
            this.addPoint(event.offsetX, event.offsetY);
        }
        else if (this.mapEditor.isFirstPoint(this.hoveredPoint)) {
            const FIRST_POINT = this.mapEditor.firstPoint;
            this.addPoint(FIRST_POINT.x, FIRST_POINT.y);
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
