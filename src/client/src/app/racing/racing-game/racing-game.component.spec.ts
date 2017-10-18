import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RacingGameComponent } from './racing-game.component';

describe('RacingGameComponent', () => {
  let component: RacingGameComponent;
  let fixture: ComponentFixture<RacingGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RacingGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RacingGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
