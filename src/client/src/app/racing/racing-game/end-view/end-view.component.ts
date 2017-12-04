import { Component } from '@angular/core';
import { EndViewService } from '../../services/end-view.service';

@Component({
    selector: 'app-end-view',
    templateUrl: './end-view.component.html',
    styleUrls: ['./end-view.component.css']
})

export class EndViewComponent {

    constructor(public endViewService: EndViewService) { }
}
