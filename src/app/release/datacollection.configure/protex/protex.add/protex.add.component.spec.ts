import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtexAddComponent } from './protex.add.component';

describe('Protex.AddComponent', () => {
  let component: ProtexAddComponent;
  let fixture: ComponentFixture<ProtexAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProtexAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtexAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
