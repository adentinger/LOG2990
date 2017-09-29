import { Component, OnInit } from '@angular/core';
import { Definition } from './class/definition';
import { DefinitionsService } from './definitions.service';
import { ClickOutsideModule } from 'ng-click-outside';


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

    public onSelect(e: Event): void {
        //this.selectedDefinition = definition;
        console.log('hi', e);
    }

    // public outsideSelect(): void {
    //     this.selectedDefinition = null;
    // }




}
