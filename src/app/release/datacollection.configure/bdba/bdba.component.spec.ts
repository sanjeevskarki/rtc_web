import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BdbaComponent } from './bdba.component';

describe('BdbaComponent', () => {
  let component: BdbaComponent;
  let fixture: ComponentFixture<BdbaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BdbaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BdbaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
