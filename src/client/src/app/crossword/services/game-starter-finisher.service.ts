import { Injectable } from '@angular/core';
import { WaitingService } from '../config-menu/waiting/waiting.service';
import { UserChoiceService, CreateOrJoin } from '../config-menu/user-choice.service';
import { GameService, GameState } from '../game.service';
import { GameHttpService } from './game-http.service';

/**
 * @class GameStarterFinisherService
 * @description Has the responsibility of starting and finishing the game.
 * This service was basically created to solve circular dependency problems between
 * GameService and GameHttpService. Yes, this probably denotes a slight architectural problem.
 */
@Injectable()
export class GameStarterFinisherService {

    constructor(private waitingService: WaitingService,
                private userChoiceService: UserChoiceService,
                private gameService: GameService,
                private gameHttpService: GameHttpService) { }

    public startGame(): void {
        this.waitingService.isWaiting.next(true);
        const isJoiningGame = this.userChoiceService.createOrJoin === CreateOrJoin.join;
        if (isJoiningGame) {
            this.gameService.state = GameState.started;
            this.gameService.joinGame(
                this.userChoiceService.chosenGame,
                this.userChoiceService.playerName
            );
        }
        else {
            this.gameHttpService.createGame(this.userChoiceService.toGameConfiguration())
                .then((gameId) => {
                    this.gameService.state = GameState.started;
                    this.gameService.joinGame(
                        gameId,
                        this.userChoiceService.playerName
                    );
                });
        }
    }

    public finishGame(wordsFound: number, opponentWordsFound: number): void {
        let message: string;
        if (wordsFound > opponentWordsFound) {
            message = 'Congratulations ; you win!';
        }
        else if (wordsFound < opponentWordsFound) {
            message = 'Congratulations ; you (almost) win!';
        }
        else {
            message = 'Congratulations ; you equaled your opponent!';
        }
        if (this.gameService.data.numberOfPlayers === 1) {
            message += '\nStart over with the same settings?';
            if (confirm(message)) {
                this.startGame();
            }
        }
        else {
            alert(message);
        }
    }

}
