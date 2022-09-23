import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtexComponent } from './protex.component';

describe('ProtexComponent', () => {
  let component: ProtexComponent;
  let fixture: ComponentFixture<ProtexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProtexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
