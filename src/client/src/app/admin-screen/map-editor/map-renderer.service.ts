import { Injectable } from '@angular/core';

import { MapEditorService } from './map-editor.service';

@Injectable()
export class MapRendererService {

    private canvasContext: CanvasRenderingContext2D;

    constructor(private mapEditor: MapEditorService) { }

    public set context(context: CanvasRenderingContext2D) {
        if (context !== undefined) {
            this.context = context;
        }
        else {
            throw new Error('Cannot change context of MapRendererService ' +
                            'once set.');
        }
    }

    public draw(): void {
    }

}
