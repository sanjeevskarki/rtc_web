import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bdba.AddComponent } from './bdba.add.component';

describe('Bdba.AddComponent', () => {
  let component: Bdba.AddComponent;
  let fixture: ComponentFixture<Bdba.AddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bdba.AddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Bdba.AddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
