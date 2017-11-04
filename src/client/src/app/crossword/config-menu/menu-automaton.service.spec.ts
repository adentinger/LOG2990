import { TestBed, inject } from '@angular/core/testing';

import { MenuAutomatonService } from './menu-automaton.service';

describe('MenuAutomatonService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
        providers: [MenuAutomatonService]
        });
    });

    it('should be created', inject([MenuAutomatonService], (service: MenuAutomatonService) => {
        expect(service).toBeTruthy();
    }));
});
