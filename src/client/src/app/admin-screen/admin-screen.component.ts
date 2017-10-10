import { Component, OnInit, OnDestroy } from '@angular/core';
import { WordConstraint } from '../common/lexic/word-constraint';
import { PacketEvent } from '../common/communication/packet-api';
import { PacketManagerService } from '../packet-manager.service';
import { PacketHandler, Class } from '../common';
import { PacketManagerClient } from '../packet-manager-client';

@Component({
    selector: 'app-admin-screen',
    templateUrl: './admin-screen.component.html',
    styleUrls: ['./admin-screen.component.css']
})
export class AdminScreenComponent implements OnInit, OnDestroy {
    public readonly JSON = JSON;
    public count = 0;
    public data: any;
    private readonly packetHandlers: [Class<any>, PacketHandler<any>][] = [];

    constructor(private packetService: PacketManagerClient) {}

    public ngOnInit(): void {
        console.log('[AdminScreen] Registering handlers');
        this.packetHandlers.push([WordConstraint,
            this.packetService.registerHandler(WordConstraint, this.wordConstraintHandler.bind(this))]);
    }

    public ngOnDestroy(): void {
        console.log('[AdminScreen] Unregistering handlers');
        for (const [type, handler] of this.packetHandlers) {
            this.packetService.unregisterHandler(type, handler);
        }
    }

    private wordConstraintHandler(event: PacketEvent<WordConstraint>): void {
        console.log('[AdminScreen] Packet Received', JSON.stringify(event));
        this.data = event.value;
        console.log('[AdminScreen] data: ', this.data);
    }

    public sendSocket(): void {
        const wc: WordConstraint = { minLength: ++this.count, isCommon: true, charConstraints: [{ char: 'a', position: 0 }] };
        console.log('[AdminScreen] Sending to server ...');
        this.packetService.sendPacket(WordConstraint, wc);
    }

}
