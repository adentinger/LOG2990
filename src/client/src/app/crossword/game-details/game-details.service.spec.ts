import { TestBed, inject } from '@angular/core/testing';

import { GameDetailsService } from './game-details.service';

describe('GameDetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameDetailsService]
    });
  });

  it('should be created', inject([GameDetailsService], (service: GameDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
