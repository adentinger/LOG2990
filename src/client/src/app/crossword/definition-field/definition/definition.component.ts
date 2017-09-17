import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-definition',
    templateUrl: './definition.component.html',
    styleUrls: ['./definition.component.css']
})
export class DefinitionComponent implements OnInit {

    public text: string;
    constructor(text: string) {
        this.text = text;
    }
    public ngOnInit(): void { }
}
