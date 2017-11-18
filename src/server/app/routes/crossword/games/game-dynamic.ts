import { Game } from './game';
import { GameDataDynamic } from './game-data-dynamic';
import { PacketHandler, PacketEvent, registerHandlers } from '../../../../../common/src/index';
import { TimerPacket } from '../../../../../common/src/crossword/packets/timer.packet';
import { CrosswordGameConfigs } from '../../../../../common/src/communication/game-configs';
import { PacketManagerServer } from '../../../packet-manager';
import { GridWord } from '../../../../../common/src/crossword/grid-word';
import { Player } from '../player';

export class GameDynamic extends Game {

    private static readonly COUNTDOWN_INITAL = 120; // seconds

    private countdown = GameDynamic.COUNTDOWN_INITAL;

    protected timerInterval: NodeJS.Timer = null;

    constructor(configs: CrosswordGameConfigs) {
        super(configs, new GameDataDynamic(configs.difficulty));
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
        this.resetTimer();
        this.stopTimer();
        this.startTimer();

        super.start();
    }

    protected startTimer() {
        if (this.timerInterval === null) {
            const ONE_SECOND = 1000; // ms
            this.timerInterval = setInterval(() => this.tick(), ONE_SECOND);
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

    protected resetTimer(): void {
        this.countdown = GameDynamic.COUNTDOWN_INITAL;
    }

    public validateUserAnswer(wordGuess: GridWord, player: Player): boolean {
        if (super.validateUserAnswer(wordGuess, player)) {
            // Reset timer
            this.resetTimer();
            return true;
        }
        return false;
    }

    private tick(): void {
        this.countdown--;
        this.players.forEach((player) => {
            this.communicationHandler.sendNewTimerValueTo(player, this.countdown);
        });

        if (this.countdown <= 0) {
            this.stopTimer();

            // Mutate our data
            const dynamicData = (this.dataInternal as GameDataDynamic);
            dynamicData.applyMutation().then(() => {
                this.players.forEach((player) => {
                    this.communicationHandler.clearPlayerGrid(player.socketId);
                    this.communicationHandler.sendGridWords(
                        player.socketId,
                        dynamicData.wordsViewedByPlayer
                    );
                    this.communicationHandler.sendDefinitions(player.socketId, dynamicData.definitions);
                });
                this.resetTimer();
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
