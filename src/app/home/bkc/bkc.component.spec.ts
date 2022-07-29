import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BkcComponent } from './bkc.component';

describe('BkcComponent', () => {
  let component: BkcComponent;
  let fixture: ComponentFixture<BkcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BkcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BkcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
