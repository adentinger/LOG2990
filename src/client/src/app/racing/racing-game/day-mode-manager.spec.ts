import { inject, TestBed } from '@angular/core/testing';

import { DayModeManager, DayMode } from './day-mode-manager';

describe('DayModeManager', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DayModeManager
            ]
        });
    });

    let dayModeManager: DayModeManager;

    beforeEach(inject([DayModeManager], (testedInstance) => {
        dayModeManager = testedInstance;
    }));

    it('should be created', () => {
        expect(dayModeManager).toBeTruthy();
        expect(dayModeManager.mode).toEqual(DayMode.DAY);
    });

    it('should update a scene\'s DayModeNotifiable elements', () => {
        // TODO
        expect(0).toEqual(1);
    });

});
