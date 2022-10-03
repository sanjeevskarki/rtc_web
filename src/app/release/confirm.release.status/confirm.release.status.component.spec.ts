import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmReleaseStatusComponent } from './confirm.release.status.component';

describe('ConfirmReleaseStatusComponent', () => {
  let component: ConfirmReleaseStatusComponent;
  let fixture: ComponentFixture<ConfirmReleaseStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmReleaseStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmReleaseStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
