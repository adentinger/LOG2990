import { ConfigMenuState } from './config-menu-state';
import { ConfigMenuOption } from './config-menu-option';
import { TestBed } from '@angular/core/testing';

describe('ConfigMenuState', () => {
    it('should create an instance', () => {
        expect(new ConfigMenuState(0, '', [])).toBeTruthy();
        expect(new ConfigMenuState(-1, '', [])).toThrowError('bad id');
    });
});
