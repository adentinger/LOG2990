import { TestBed, inject } from '@angular/core/testing';

import { AdminConfigService } from './admin-config.service';

describe('AdminConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminConfigService]
    });
  });

  it('should be created', inject([AdminConfigService], (service: AdminConfigService) => {
    expect(service).toBeTruthy();
  }));
});
