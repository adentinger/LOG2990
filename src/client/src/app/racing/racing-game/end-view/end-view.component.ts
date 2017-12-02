import { Component, Input } from '@angular/core';
import { EndViewService } from '../../services/end-view.service';

@Component({
    selector: 'app-end-view',
    templateUrl: './end-view.component.html',
    styleUrls: ['./end-view.component.css']
})

export class EndViewComponent {

    constructor(private endViewService: EndViewService) { }

    public displayBestTimeComponent(): void {
        this.endViewService.displayGameResult = false;
    }
}
