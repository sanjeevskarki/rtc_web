import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KwComponent } from './kw.component';

describe('KwComponent', () => {
  let component: KwComponent;
  let fixture: ComponentFixture<KwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KwComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
