import * as SocketIOClient from 'socket.io-client';
import { Injectable } from '@angular/core';
import { PacketManagerClient } from './common/communication/packet-api/packet-manager-client';
import './common/lexic/word-packet';

export const packetManagerClient: PacketManagerClient = new PacketManagerClient(SocketIOClient('http://localhost:3030'));

@Injectable()
export class PacketManagerService {
    constructor(public packetManager: PacketManagerClient) { }
}
