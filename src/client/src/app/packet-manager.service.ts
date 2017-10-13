import * as SocketIOClient from 'socket.io-client';
import { Injectable } from '@angular/core';
import { PacketManagerClient } from './packet-manager-client';
import { PacketHandler, WordConstraint, PacketEvent, registerHandlers } from './common';
import './common/lexic/word-packet';

export const packetManagerClient: PacketManagerClient = new PacketManagerClient(SocketIOClient('http://localhost:3030'));

@Injectable()
export class PacketManagerService {
    public data: any;

    constructor(public packetManager: PacketManagerClient) {
        registerHandlers(this, packetManager);
    }

    @PacketHandler(WordConstraint)
    // tslint:disable-next-line:no-unused-variable
    private wordConstraintHandler(event: PacketEvent<WordConstraint>): void {
        console.log('[AdminScreen] Packet Received', JSON.stringify(event));
        this.data = event.value;
        console.log('[AdminScreen] data: ', this.data);
    }
}
