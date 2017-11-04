import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-config-menu',
    templateUrl: './config-menu.component.html',
    styleUrls: ['./config-menu.component.css']
})
export class ConfigMenuComponent implements OnInit {

    public isConfiguringGame = true;

    constructor() { }

    public ngOnInit(): void {
    }

    public log(...args): void {
        console.log(...args);
    }

}
