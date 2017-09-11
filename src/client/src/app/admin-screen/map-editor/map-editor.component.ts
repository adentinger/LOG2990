import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Path } from './path';
import { Point } from './point';

@Component({
    selector: 'app-map-editor',
    templateUrl: './map-editor.component.html',
    styleUrls: [ './map-editor.component.css']
})
export class MapEditorComponent implements OnInit {
    private ctxt: CanvasRenderingContext2D;
    public mockPath: Path;
    @ViewChild('editingArea') private editingArea: ElementRef;

    private width = 500;
    private height = 500;

    constructor() { }
    public ngOnInit(): void {
        this.ctxt = this.editingArea.nativeElement.getContext('2d');
        this.mockPath = new Path( this.ctxt, [] );
    }
    private addPoint(mouseDown): void {
        this.mockPath.points.push(new Point(this.ctxt,
                                            mouseDown.offsetX,
                                            mouseDown.offsetY));
        this.drawPath();
    }

    private undoLastPoint(): void {
        this.mockPath.points.pop();
        this.drawPath();
    }

    private drawPath(): void {
        this.ctxt.clearRect(0, 0, this.width, this.height);
        this.mockPath.draw();
    }
}
