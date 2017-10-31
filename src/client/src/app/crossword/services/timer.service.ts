import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { PacketManagerClient } from '../../packet-manager-client';
import { CrosswordTimerPacket } from '../../../../../common/src/crossword/packets/crossword-timer.packet';
import { PacketHandler, PacketEvent } from '../../../../../common/src/index';
import '../../../../../common/src/crossword/packets/crossword-timer.parser';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class TimerService {

    private static DEFAULT_TIME = 3600000;

    private timerInternal = new Subject<number>();
    private timerValueInternal: number;
    private serverTimerSubscription: Subscription;

    constructor(private packetManager: PacketManagerClient) {
        this.timer.subscribe((value) => {
            this.timerValueInternal = value;
        });
        this.timer.next(TimerService.DEFAULT_TIME);
        this.serverTimerSubscription =
            this.subscribeServerToTimeChanges();
    }

    public get timer(): Subject<number> {
        return this.timerInternal;
    }

    @PacketHandler(CrosswordTimerPacket)
    // tslint:disable-next-line:no-unused-variable
    private timeChanged(event: PacketEvent<CrosswordTimerPacket>) {
        console.log(event.value);
        this.serverTimerSubscription.unsubscribe();
        this.timer.next(event.value.countdown);
        this.serverTimerSubscription =
            this.subscribeServerToTimeChanges();
    }

    private subscribeServerToTimeChanges(): Subscription {
        return this.timer.subscribe((value) => {
            this.packetManager.sendPacket(
                CrosswordTimerPacket,
                new CrosswordTimerPacket(value)
            );
        });
    }

}
