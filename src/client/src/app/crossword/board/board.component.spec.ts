import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardComponent } from './board.component';
import { CrosswordTileComponent } from './crossword-tile/crossword-tile.component';
import { CrosswordGameService } from '../crossword-game.service';
import { PacketManagerClient } from '../../packet-manager-client';
import { packetManagerClient } from '../../packet-manager.service';

describe('BoardComponent', () => {
    let component: BoardComponent;
    let fixture: ComponentFixture<BoardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BoardComponent, CrosswordTileComponent],
            providers: [
                CrosswordGameService,
                {provide: PacketManagerClient, useValue: packetManagerClient}
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BoardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
