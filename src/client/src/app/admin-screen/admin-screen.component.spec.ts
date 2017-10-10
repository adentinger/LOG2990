import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminScreenComponent } from './admin-screen.component';
import { PacketManagerService, packetManagerClient } from '../packet-manager.service';
import { PacketManagerClient } from '../common/communication/packet-api/packet-manager-client';

describe('AdminScreenComponent', () => {
  let component: AdminScreenComponent;
  let fixture: ComponentFixture<AdminScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminScreenComponent ],
      providers: [
          PacketManagerService,
          {provide: PacketManagerClient, useValue: packetManagerClient}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
