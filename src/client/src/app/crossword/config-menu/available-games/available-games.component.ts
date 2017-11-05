import { Component, OnInit } from '@angular/core';

import { GameService } from '../../services/game.service';

@Component({
    selector: 'app-available-games',
    templateUrl: './available-games.component.html',
    styleUrls: ['./available-games.component.css']
})
export class AvailableGamesComponent implements OnInit {

    constructor(public gameService: GameService) { }

    public ngOnInit() {
    }

}
