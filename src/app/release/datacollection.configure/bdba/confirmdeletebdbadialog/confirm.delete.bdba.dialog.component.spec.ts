import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteBdbaDialogComponent } from './confirm.delete.bdba.dialog.component';

describe('ChecklistConfirmDialogComponent', () => {
  let component: ConfirmDeleteBdbaDialogComponent;
  let fixture: ComponentFixture<ConfirmDeleteBdbaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteBdbaDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteBdbaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
