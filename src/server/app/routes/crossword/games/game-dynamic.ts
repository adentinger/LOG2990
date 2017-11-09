import { Game } from './game';
import { PacketHandler, PacketEvent } from '../../../../../common/src/index';
import { TimerPacket } from '../../../../../common/src/crossword/packets/timer.packet';

export class GameDynamic extends Game {

    private static readonly COUNTDOWN_INITAL = 3600; // 1 hour<

    public countdown = GameDynamic.COUNTDOWN_INITAL;

    protected start(): void {
        if (!this.started) {
            this.startTimer();
            super.start();
        }
    }

    private startTimer() {
        const ONE_SECOND = 1000;
        this.timerInterval = setInterval(() => {
            this.countdown--;
            this.players.forEach((player) => {
                this.communicationHandler.sendNewTimerValueTo(player, this.countdown);
            });
        }, ONE_SECOND);
    };

    @PacketHandler(TimerPacket)
    // tslint:disable-next-line:no-unused-variable
    private getCheatModeTimerValue(event: PacketEvent<TimerPacket>) {
        if (this.isSocketIdInGame(event.socketid)) {
            console.log('setting countdown for game', this.id, 'to', event.value.countdown);
            this.countdown = event.value.countdown;
        }
    }

}
