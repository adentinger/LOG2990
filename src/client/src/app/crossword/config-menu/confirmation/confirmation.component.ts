import { Component, OnInit } from '@angular/core';

import { MenuAutomatonService } from '../menu-automaton.service';
import { UserChoiceService } from '../user-choice.service';

@Component({
    selector: 'app-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

    constructor(public menuAutomaton: MenuAutomatonService,
                public userChoiceService: UserChoiceService) { }

    public ngOnInit(): void {
    }

}
