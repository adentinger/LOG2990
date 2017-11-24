import { Component, OnInit } from '@angular/core';
import { WaitingService } from './waiting.service';
import { GameService } from '../../game.service';

@Component({
    selector: 'app-waiting',
    templateUrl: './waiting.component.html',
    styleUrls: ['./waiting.component.css'],
})
export class WaitingComponent implements OnInit {

    public get waitingText(): string {
        if (this.gameService.data.currentNumberOfPlayers < this.gameService.data.maxNumberOfPlayers) {
            return 'Waiting for more awesome players to join...';
        }
        else {
            return 'Waiting for some cool data to arrive...';
        }
    }

    constructor(public waitingService: WaitingService,
                private gameService: GameService) { }

    public ngOnInit(): void {
    }

}
