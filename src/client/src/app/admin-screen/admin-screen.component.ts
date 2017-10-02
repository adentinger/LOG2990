import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { WordConstraint } from 'common/lexic/word-constraint';
import { WordConstraintPacketParser } from 'common/lexic/word-packet';
import { PacketManager } from 'common/communication/packet-api';

@Component({
    selector: 'app-admin-screen',
    templateUrl: './admin-screen.component.html',
    styleUrls: ['./admin-screen.component.css']
})
export class AdminScreenComponent implements OnInit {
    public readonly JSON = JSON;
    private socket: SocketIOClient.Socket;
    private parser = new WordConstraintPacketParser();
    public data: any;

    constructor() { }

    public ngOnInit(): void {
        this.socket = io('http://localhost:3030', {transports: ['websocket']});
        this.socket.on('message', (...argv: any[]) => {
            console.log.apply(console, argv);
            if (argv[1]) {
                this.data = this.parser.parse(PacketManager.prototype['toArrayBuffer'](argv[1]));
            }
        });
    }

    public sendSocket(): void {
        const wc: WordConstraint = { minLength: 1, isCommon: true, charConstraints: [{ char: 'a', position: 0 }] };
        console.log(this.parser.parse(this.parser.serialize(wc)));
        this.socket.send(`packet:${WordConstraint.name}`,
        String.fromCharCode.apply(null, new Uint16Array(this.parser.serialize(wc))));
    }

}
