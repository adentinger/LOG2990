import { TestBed, inject } from '@angular/core/testing';

import { UserChoiceService } from './user-choice.service';

describe('UserChoiceService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [UserChoiceService]
        });
    });

    it('should be created', inject([UserChoiceService], (service: UserChoiceService) => {
        expect(service).toBeTruthy();
    }));
});
