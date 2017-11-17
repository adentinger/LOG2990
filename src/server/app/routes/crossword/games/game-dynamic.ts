import { Game } from './game';
import { GameDataDynamic } from './game-data-dynamic';
import { PacketHandler, PacketEvent, registerHandlers } from '../../../../../common/src/index';
import { TimerPacket } from '../../../../../common/src/crossword/packets/timer.packet';
import { CrosswordGameConfigs } from '../../../../../common/src/communication/game-configs';
import { PacketManagerServer } from '../../../packet-manager';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { GridMutator } from '../grid-generator/grid-mutator';
import { toGridGeneratorDifficulty } from './temp-util';

export class GameDynamic extends Game {

    private static readonly COUNTDOWN_INITAL = 120; // seconds

    private countdown = GameDynamic.COUNTDOWN_INITAL;
    private mutator: GridMutator;

    protected timerInterval: NodeJS.Timer = null;

    constructor(configs: CrosswordGameConfigs) {
        super(configs, new GameDataDynamic(configs.difficulty));
        this.mutator = new GridMutator(toGridGeneratorDifficulty(configs.difficulty));
        registerHandlers(this, PacketManagerServer.getInstance());
    }

    public deletePlayerBySocketid(socketId: string): void {
        const index =
            this.players.findIndex((existingPlayer) => existingPlayer.socketId === socketId);
        const found = index >= 0;
        if (found) {
            this.stopTimer();
        }
        super.deletePlayerBySocketid(socketId);
    }

    protected start(): void {
        // Reset timer
        this.stopTimer();
        this.startTimer();

        super.start();
    }

    protected startTimer() {
        if (this.timerInterval === null) {
            const ONE_SECOND = 1000; // ms
            this.timerInterval = setInterval(() => this.decrementTimer(), ONE_SECOND);
        }
    }

    protected stopTimer(): void {
        if (this.timerInterval !== null) {
            // Stop countdown
            this.players.forEach(player => {
                this.communicationHandler.sendNewTimerValueTo(player, 0);
            });
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    public validateUserAnswer(wordGuess: GridWord, socketId: string): boolean {
        if (super.validateUserAnswer(wordGuess, socketId)) {
            // Reset timer
            this.countdown = GameDynamic.COUNTDOWN_INITAL;
            return true;
        }
        return false;
    }

    private decrementTimer(): void {
        this.countdown--;
        this.players.forEach((player) => {
            this.communicationHandler.sendNewTimerValueTo(player, this.countdown);
        });
        if (this.countdown === 0) {
            this.countdown = GameDynamic.COUNTDOWN_INITAL;
            this.stopTimer();
            this.mutator.mutatedGrid.then((grid) => {
                this.players.forEach((player) => {
                    this.communicationHandler.clearPlayerGrid(player.socketId);
                    // TODO set grid in data.
                    this.communicationHandler.sendGridWords(
                        player.socketId,
                        this.dataInternal.wordsViewedByPlayer
                    );
                });
                this.startTimer();
            });
        }
    }

    @PacketHandler(TimerPacket)
    // tslint:disable-next-line:no-unused-variable
    private getCheatModeTimerValue(event: PacketEvent<TimerPacket>) {
        if (this.isSocketIdInGame(event.socketid)) {
            this.countdown = event.value.countdown;
        }
    }

}
