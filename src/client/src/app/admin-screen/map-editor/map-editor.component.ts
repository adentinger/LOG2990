import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

    public width = 500;
    public height = 500;

    constructor() { }
    public ngOnInit(): void {
        this.ctxt = this.editingArea.nativeElement.getContext('2d');
        this.mockPath = new Path( this.ctxt, [] );
    }

    public addPoint(event: MouseEvent): void {
        this.mockPath.points.push(new Point(this.ctxt,
                                            event.offsetX,
                                            event.offsetY));
        this.drawPath();
    }

    public undoLastPoint(): void {
        this.mockPath.points.pop();
        this.drawPath();
    }

    private drawPath(): void {
        this.ctxt.clearRect(0, 0, this.width, this.height);
        this.mockPath.draw();
    }

    public mouseMoved(event: MouseEvent): void {
        this.mockPath.points.forEach(point => {
            // tslint:disable-next-line:no-bitwise
            if (point.isMouseOver(event.offsetX, event.offsetY) && (event.buttons & 1)) {
                point.x = event.offsetX;
                point.y = event.offsetY;
                this.drawPath();
            }
        });
    }
}
