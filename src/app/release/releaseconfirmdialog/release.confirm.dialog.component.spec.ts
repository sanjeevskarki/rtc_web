import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseConfirmDialogComponent } from './release.confirm.dialog.component';

describe('ReleaseConfirmDialogComponent', () => {
  let component: ReleaseConfirmDialogComponent;
  let fixture: ComponentFixture<ReleaseConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReleaseConfirmDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
