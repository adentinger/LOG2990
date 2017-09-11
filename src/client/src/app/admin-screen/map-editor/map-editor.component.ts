import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Map } from './map';
import { Point } from './point';

@Component({
    selector: 'app-map-editor',
    templateUrl: './map-editor.component.html',
    styleUrls: [ './map-editor.component.css']
})
export class MapEditorComponent implements OnInit {
    private ctxt: CanvasRenderingContext2D;
    public map: Map = new Map('test1', 'amateur', 'description', []);
    @ViewChild('editingArea') private editingArea: ElementRef;

    private width = 500;
    private height = 500;

    constructor() { }

    public addPoint(x, y) {
        this.map.points.push(new Point(x, y));
    }

    public undoLastPoint() {
        console.log('hello!');
        this.map.points.pop();
    }

    private onmousedown(mouseDown) {
        this.addPoint(mouseDown.offsetX, mouseDown.offsetY);
        this.map.points.forEach(points => {
            this.ctxt.fillRect(points.x, points.y, 10, 10);
        });
    }

    public ngOnInit() {
        this.ctxt = this.editingArea.nativeElement.getContext('2d');
    }
}
