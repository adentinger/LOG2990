import { Component, OnInit } from '@angular/core';
import { WordConstraint } from '../common/lexic/word-constraint';
import { PacketManagerService } from '../packet-manager.service';

@Component({
    selector: 'app-admin-screen',
    templateUrl: './admin-screen.component.html',
    styleUrls: ['./admin-screen.component.css']
})
export class AdminScreenComponent implements OnInit {
    public readonly JSON = JSON;
    public count = 0;
    public get data() {
        return this.packetService.data;
    }

    constructor(private packetService: PacketManagerService) {}

    public ngOnInit(): void {
    }

    public sendSocket(): void {
        const wc: WordConstraint = { minLength: ++this.count, isCommon: true, charConstraints: [{ char: 'a', position: 0 }] };
        console.log('[AdminScreen] Sending to server ...');
        this.packetService.packetManager.sendPacket(WordConstraint, wc);
    }

}
