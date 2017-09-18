import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { MapEditorService } from './map-editor.service';
import { MapRendererService } from './map-renderer/map-renderer.service';

@Component({
    selector: 'app-map-editor',
    templateUrl: './map-editor.component.html',
    styleUrls: ['./map-editor.component.css'],
    providers: [MapEditorService, MapRendererService]
})
export class MapEditorComponent implements OnInit {
    private ctxt: CanvasRenderingContext2D;
    @ViewChild('editingArea') private editingArea: ElementRef;

    public width = 500;
    public height = 500;

    constructor(private mapEditor: MapEditorService,
                private mapRenderer: MapRendererService) { }

    public ngOnInit(): void {
        this.ctxt = this.editingArea.nativeElement.getContext('2d');
        this.mapRenderer.context = this.ctxt;
    }

    public addPoint(event: MouseEvent): void {
    }

    public undoLastPoint(): void {
    }

    public mouseMoved(event: MouseEvent): void {
        this.mapRenderer.draw();
    }
}
