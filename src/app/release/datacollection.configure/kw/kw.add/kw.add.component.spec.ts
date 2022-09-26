import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KwAddComponent } from './kw.add.component';

describe('KwAddComponent', () => {
  let component: KwAddComponent;
  let fixture: ComponentFixture<KwAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KwAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KwAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
