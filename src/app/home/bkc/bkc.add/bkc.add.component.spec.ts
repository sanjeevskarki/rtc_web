import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BkcAddComponent } from './bkc.add.component';

describe('Bkc.AddComponent', () => {
  let component: BkcAddComponent;
  let fixture: ComponentFixture<BkcAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BkcAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BkcAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
