import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistConfirmDialogComponent } from './checklist.confirm.dialog.component';

describe('ChecklistConfirmDialogComponent', () => {
  let component: ChecklistConfirmDialogComponent;
  let fixture: ComponentFixture<ChecklistConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChecklistConfirmDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
