import { TestBed, inject } from '@angular/core/testing';

import { WaitingService } from './waiting.service';

describe('WaitingService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [WaitingService]
        });
    });

    let waitingService: WaitingService;

    beforeEach(inject([WaitingService], (waitingServiceInjected: WaitingService) => {
        waitingService = waitingServiceInjected;
    }));

    it('should be created', () => {
        expect(waitingService).toBeTruthy();
    });

    it('should provide a subject on which we can send a new value', () => {
        let hasBeenNotified = false;
        waitingService.isWaiting.subscribe(() => hasBeenNotified = true);
        waitingService.isWaiting.next(false);
        expect(hasBeenNotified).toBe(true);
    });

    it('should keep the current value consistent with the emitted value', () => {
        for (let i = 0; i < 10; ++i) {
            const newValue = !waitingService.isWaitingValue;
            waitingService.isWaiting.next(newValue);
            expect(waitingService.isWaitingValue).toEqual(newValue);
        }
    });

});
