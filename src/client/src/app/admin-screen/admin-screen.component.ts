import { Component, OnInit } from '@angular/core';
import { WordConstraint } from 'common/lexic/word-constraint';
import { PacketEvent } from 'common/communication/packet-api';
import { PacketManagerService } from '../packet-manager.service';

@Component({
    selector: 'app-admin-screen',
    templateUrl: './admin-screen.component.html',
    styleUrls: ['./admin-screen.component.css']
})
export class AdminScreenComponent implements OnInit {
    public readonly JSON = JSON;
    public count = 0;
    public data: any;

    constructor(private packetService: PacketManagerService) {}

    public ngOnInit(): void {
        this.packetService.packetManager.registerHandler(WordConstraint, this.wordConstraintHandler.bind(this));
    }

    private wordConstraintHandler(event: PacketEvent<WordConstraint>): void {
        console.log('[AdminScreen] Packet Received', JSON.stringify(event));
        this.data = event.value;
        console.log('[AdminScreen] data: ', this.data);
    }

    public sendSocket(): void {
        const wc: WordConstraint = { minLength: ++this.count, isCommon: true, charConstraints: [{ char: 'a', position: 0 }] };
        console.log('[AdminScreen] Sending to server ...');
        this.packetService.packetManager.sendPacket(WordConstraint, wc);
    }

}
