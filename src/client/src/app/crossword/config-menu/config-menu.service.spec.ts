import { TestBed, inject } from '@angular/core/testing';

import { ConfigMenuService } from './config-menu.service';

describe('ConfigMenuService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigMenuService]
    });
  });

  it('should be created', inject([ConfigMenuService], (service: ConfigMenuService) => {
    expect(service).toBeTruthy();
  }));
});
