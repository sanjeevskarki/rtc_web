import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bkc.AddComponent } from './bkc.add.component';

describe('Bkc.AddComponent', () => {
  let component: Bkc.AddComponent;
  let fixture: ComponentFixture<Bkc.AddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bkc.AddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bkc.AddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
