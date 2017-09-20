import { Injectable } from '@angular/core';

import { MapEditorService } from '../map-editor.service';
import { Drawable } from './drawable';
import { MapPath } from './map-path';
import { Point } from '../point';

@Injectable()
export class MapRendererService implements Drawable {

    private canvasElement: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private path: MapPath;
    private activePoint: Point = null;

    constructor(private mapEditor: MapEditorService) {
        this.path = new MapPath(this.context, []);
    }

    public set canvas(canvas: HTMLCanvasElement) {
        if (this.canvasElement === undefined) {
            this.canvasElement = canvas;
            this.context = this.canvasElement.getContext('2d');
            this.path = new MapPath(this.context, []);
        }
        else {
            throw new Error('Cannot change context of MapRendererService ' +
                'once set.');
        }
    }

    public draw(): void {
        if (this.canvasElement !== undefined) {
            this.clear();
            this.path.updatePoints(this.mapEditor.points);
            this.path.draw();
        }
        else {
            throw new Error('Cannot draw map: context not set.');
        }
    }

    private pointWithCoordinates(coordinates: Point): Point {
        return null;
    }

    public moveCursorTo(coordinates: Point): void {
        this.activePoint = this.pointWithCoordinates(coordinates);
    }

    private clear(): void {
        this.context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    }

}
