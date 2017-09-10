import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Map } from './map';

@Component({
    selector: 'app-map-editor',
    templateUrl: './map-editor.component.html',
    styleUrls: [ './map-editor.component.css']
})
export class MapEditorComponent {

    public map: Map = { height: 500, length: 500, points: []};

    @ViewChild("myMap") private myMap: ElementRef;

    constructor() { }

    ngOnInit() {
        const ctxt: CanvasRenderingContext2D =
            this.myMap.nativeElement.getContext('2d');
        ctxt.strokeRect(0, 0, this.map.length, this.map.height);
    }

}
