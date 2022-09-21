import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteStakeholderDialogComponent } from './confirm.delete.stakeholder.dialog.component';

describe('ChecklistConfirmDialogComponent', () => {
  let component: ConfirmDeleteStakeholderDialogComponent;
  let fixture: ComponentFixture<ConfirmDeleteStakeholderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteStakeholderDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteStakeholderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
