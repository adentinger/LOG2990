import { Component, OnInit } from '@angular/core';
import { SimpleTimer } from 'ng2-simple-timer';
import { DefinitionsService } from './definition-field/definitions.service';
import { CrosswordGameService } from './crossword-game.service';
import { TimerService } from './services/timer.service';
import { ConfigMenuService } from './config-menu/config-menu.service';

@Component({
    selector: 'app-crossword',
    templateUrl: './crossword.component.html',
    providers: [
        SimpleTimer,
        DefinitionsService,
        TimerService,
        ConfigMenuService
    ]
})
export class CrosswordComponent implements OnInit {

    public gameIsBeingConfigured = true;

    constructor(private crosswordGameService: CrosswordGameService) { }

    public ngOnInit(): void {
    }

    public isShowWordsOn(): boolean {
        return this.crosswordGameService.getShowWordsState();
    }

}
