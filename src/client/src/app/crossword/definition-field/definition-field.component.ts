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

    constructor(private service: DefinitionsService) { }

    public ngOnInit(): void {
        this.definitions = this.service.getDefinitions();
    }
}
