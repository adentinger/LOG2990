import { TestBed, inject } from '@angular/core/testing';

import { RacingGameService } from './racing-game.service';

describe('RacingGameService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RacingGameService]
    });
  });

  it('should be created', inject([RacingGameService], (service: RacingGameService) => {
    expect(service).toBeTruthy();
  }));
});
