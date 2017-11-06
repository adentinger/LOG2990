import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WaitingService } from './waiting.service';

@Component({
    selector: 'app-waiting',
    templateUrl: './waiting.component.html',
    styleUrls: ['./waiting.component.css'],
})
export class WaitingComponent implements OnInit {

    @Output()
    private waiting;

    constructor(private waitingService: WaitingService) { }

    public ngOnInit(): void {
    }

}
