import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-end-view',
    templateUrl: './end-view.component.html',
    styleUrls: ['./end-view.component.css']
})

export class EndViewComponent {

    @Input() public displayGameResult;

    constructor() { }
}
