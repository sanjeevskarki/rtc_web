import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Kw.AddComponent } from './kw.add.component';

describe('Kw.AddComponent', () => {
  let component: Kw.AddComponent;
  let fixture: ComponentFixture<Kw.AddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Kw.AddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Kw.AddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
