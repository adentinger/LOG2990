import { Injectable } from '@angular/core';
import { PacketManagerClient } from '../../packet-manager-client';
import { PacketEvent, PacketHandler, registerHandlers } from '../../../../../common/src/index';
import { CrosswordTimerPacket } from '../../../../../common/src/crossword/packets/crossword-timer.packet';
import '../../../../../common/src/crossword/packets/crossword-timer.parser';

@Injectable()
export class GameDetailsService {

    public countdown = 0;

    // tslint:disable-next-line:no-unused-variable
    constructor(private packetManager: PacketManagerClient) {
        registerHandlers(this, packetManager);
    }

    @PacketHandler(CrosswordTimerPacket)
    // tslint:disable-next-line:no-unused-variable
    private handleCrosswordTimer(event: PacketEvent<CrosswordTimerPacket>) {
        this.countdown = event.value.countdown;
    }

}
