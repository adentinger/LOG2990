import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'app-map-editor',
    templateUrl: './map-editor.component.html',
    styleUrls: [ './map-editor.component.css']
})
export class MapEditorComponent implements OnInit {
    private ctxt: CanvasRenderingContext2D;
    @ViewChild('editingArea') private editingArea: ElementRef;

    public width = 500;
    public height = 500;

    constructor() { }
    public ngOnInit(): void {
        this.ctxt = this.editingArea.nativeElement.getContext('2d');
    }

    public addPoint(event: MouseEvent): void {
        // Add point
        this.drawPath();
    }

    public undoLastPoint(): void {
    }

    private drawPath(): void {
    }

    public mouseMoved(event: MouseEvent): void {
    }
}
