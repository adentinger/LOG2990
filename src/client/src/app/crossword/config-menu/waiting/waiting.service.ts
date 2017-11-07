import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { PacketManagerClient } from '../../../packet-manager-client';
import { PacketHandler, PacketEvent, registerHandlers } from '../../../../../../common/src/index';

import { GameStartPacket } from '../../../../../../common/src/crossword/packets/game-start.packet';
import '../../../../../../common/src/crossword/packets/game-start.parser';

/**
 * @class WaitingService
 * @description Has the responsibility of containing whether we are waiting,
 * and notifying when we no longer wait.
 */
@Injectable()
export class WaitingService {

    private isWaitingInternal = new Subject<boolean>();
    private isWaitingValueInternal = false;

    constructor(private packetManager: PacketManagerClient) {
        this.isWaitingInternal.subscribe((value) => {
            this.isWaitingValueInternal = value;
        });
        registerHandlers(this, packetManager);
    }

    public get isWaiting(): Subject<boolean> {
        return this.isWaitingInternal;
    }

    public get isWaitingValue(): boolean {
        return this.isWaitingValueInternal;
    }

    @PacketHandler(GameStartPacket)
    // tslint:disable-next-line:no-unused-variable
    private gameStarted(event: PacketEvent<GameStartPacket>): void {
        this.isWaitingInternal.next(false);
    }

}
