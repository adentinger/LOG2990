import { Component, OnInit } from '@angular/core';
import { DefinitionComponent } from './definition/definition.component';

const DEFINITIONS_MOCK: string[] = [
    `At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum
    deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non
    provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.`,
    `Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est
    eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas
    assumenda est, omnis dolor repellendus.`,
    `Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et
    voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus,
    ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.`];

@Component({
    selector: 'app-definition-field',
    templateUrl: './definition-field.component.html',
    styleUrls: ['./definition-field.component.css']
})
export class DefinitionFieldComponent implements OnInit {

    public definitions: DefinitionComponent[] = [];

    constructor() {
        for (const definition of DEFINITIONS_MOCK) {
            this.definitions.push(new DefinitionComponent(definition));
        }
    }

    public ngOnInit(): void { }
}
