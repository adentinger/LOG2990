import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Map } from './map';

@Component({
    selector: 'app-map-editor',
    templateUrl: './map-editor.component.html',
    styleUrls: [ './map-editor.component.css']
})
export class MapEditorComponent {

    public map: Map = { height: 500, lenght: 500, points: []};
    public tmp: number;

    @ViewChild("myMap") private myMap: ElementRef;

    constructor() { }

    ngOnInit() {
        const ctxt: CanvasRenderingContext2D =
            this.myMap.nativeElement.getContext('2d');
        ctxt.strokeRect(0, 0, 500, 500);
        ctxt.clip('evenodd');
        ctxt.beginPath();
        ctxt.fillStyle = '#DD0031';
        for (let i = 0; i < 50000; ++i) {
            const x = Math.random() * 500;
            const y = Math.random() * 500;
            ctxt.moveTo(x, y);
            ctxt.arc(x, y, 0.8, 0, Math.PI * 2);
        }
        ctxt.fill();
    }

}
