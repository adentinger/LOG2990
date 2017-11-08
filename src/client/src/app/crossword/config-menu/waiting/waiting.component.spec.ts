import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingComponent } from './waiting.component';
import { WaitingService } from './waiting.service';
import { PacketManagerClient } from '../../../packet-manager-client';
import { packetManagerClient } from '../../../packet-manager.service';

describe('WaitingComponent', () => {
    let component: WaitingComponent;
    let fixture: ComponentFixture<WaitingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ WaitingComponent ],
            providers: [
                WaitingService,
                {provide: PacketManagerClient, useValue: packetManagerClient}
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WaitingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
