import { Component, OnInit } from '@angular/core';

import { BasicService } from './basic.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor(private basicService: BasicService) { }

    public title = 'LOG2990';
    public message: string;

    public ngOnInit(): void {

    }
}
