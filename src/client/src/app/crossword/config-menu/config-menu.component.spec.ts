import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';

import { ConfigMenuComponent } from './config-menu.component';

describe('ConfigMenuComponent', () => {
    let component: ConfigMenuComponent;
    let fixture: ComponentFixture<ConfigMenuComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ConfigMenuComponent],
            providers: [{provide: Location, useClass: SpyLocation}]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfigMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
