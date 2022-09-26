import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BdbaAddComponent } from './bdba.add.component';

describe('BdbaAddComponent', () => {
  let component: BdbaAddComponent;
  let fixture: ComponentFixture<BdbaAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BdbaAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BdbaAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
