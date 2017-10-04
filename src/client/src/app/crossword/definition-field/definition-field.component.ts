import { Component, OnInit } from '@angular/core';
import { Definition } from './class/definition';
import { DefinitionsService } from './definitions.service';

@Component({
    selector: 'app-definition-field',
    templateUrl: './definition-field.component.html',
    styleUrls: ['./definition-field.component.css'],
    providers: [DefinitionsService]
})
export class DefinitionFieldComponent implements OnInit {

    public definitions: Definition[] = [];
    public selectedDefinition: Definition = null;

    constructor(private service: DefinitionsService) { }

    public ngOnInit(): void {
        this.definitions = this.service.getDefinitions();
    }
/*
    //send definition on click
    public selected(): void {
        for (let i = 0; i < this.definitions.length; i++) {
            if (this.selectedDefinition === this.definitions[i]) {
                this.service.
            }
        }
    }*/
}
