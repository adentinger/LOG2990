import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { WordConstraint } from 'common/lexic/word-constraint';
import { WordConstraintPacketParser } from 'common/lexic/word-packet';
import { PacketManagerClient } from 'common/communication/packet-api/packet-manager-client';
import { PacketEvent } from 'common/communication/packet-api';

@Component({
    selector: 'app-admin-screen',
    templateUrl: './admin-screen.component.html',
    styleUrls: ['./admin-screen.component.css']
})
export class AdminScreenComponent implements OnInit {
    public readonly JSON = JSON;
    private packetManager: PacketManagerClient;
    private parser = new WordConstraintPacketParser();
    public data: any;

    constructor() { }

    public ngOnInit(): void {
        this.packetManager = new PacketManagerClient(io('http://localhost:3030', {transports: ['websocket']}));
        this.packetManager.registerParser(WordConstraint, this.parser);
        this.packetManager.registerHandler(WordConstraint, (event: PacketEvent<WordConstraint>) => {
            this.data = event.value;
        });
    }

    public sendSocket(): void {
        const wc: WordConstraint = { minLength: 1, isCommon: true, charConstraints: [{ char: 'a', position: 0 }] };
        console.log(this.parser.parse(this.parser.serialize(wc)));
        this.packetManager.sendPacket(WordConstraint, wc);
    }

}
