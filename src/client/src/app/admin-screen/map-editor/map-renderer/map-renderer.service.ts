import { Injectable } from '@angular/core';

import { MapEditorService } from '../map-editor.service';
import { Drawable } from './drawable';
import { MapPath } from './map-path';

@Injectable()
export class MapRendererService implements Drawable {

    private canvasContext: CanvasRenderingContext2D;
    private path: MapPath;

    constructor(private mapEditor: MapEditorService) {
        this.path = new MapPath(this.canvasContext, []);
    }

    public set context(context: CanvasRenderingContext2D) {
        if (this.canvasContext === undefined) {
            this.canvasContext = context;
            this.path = new MapPath(this.canvasContext, []);
        }
        else {
            throw new Error('Cannot change context of MapRendererService ' +
                            'once set.');
        }
    }

    public draw(): void {
        if (this.canvasContext !== undefined) {
            this.path.updatePoints(this.mapEditor.points);
            this.path.draw();
        }
        else {
            throw new Error('Cannot draw map: context not set.');
        }
    }

}
