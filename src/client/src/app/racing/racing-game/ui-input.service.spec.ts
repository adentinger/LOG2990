import { TestBed, inject } from '@angular/core/testing';

import { UIInputs } from './ui-input.service';

describe('UIInputService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [UIInputs]
        });
    });

    it('should be created', inject([UIInputs], (service: UIInputs) => {
        expect(service).toBeTruthy();
    }));
});
