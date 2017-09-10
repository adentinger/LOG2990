import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefinitionFieldComponent } from './definition-field.component';

describe('DefinitionFieldComponent', () => {
  let component: DefinitionFieldComponent;
  let fixture: ComponentFixture<DefinitionFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefinitionFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefinitionFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
