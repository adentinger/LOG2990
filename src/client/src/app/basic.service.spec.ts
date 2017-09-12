import { TestBed, inject } from '@angular/core/testing';

import { AppModule } from './app.module';

import { BasicService } from './basic.service';
import { APP_BASE_HREF } from '@angular/common';

describe('BasicService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AppModule
            ],
            providers: [{provide: APP_BASE_HREF, useValue: '/'}]
        });
    });

    it('should be created', inject([BasicService], (service: BasicService) => {
        expect(service).toBeTruthy();
    }));
});
