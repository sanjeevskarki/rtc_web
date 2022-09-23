import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteBkcDialogComponent } from './confirm.delete.bkc.dialog.component';

describe('ChecklistConfirmDialogComponent', () => {
  let component: ConfirmDeleteBkcDialogComponent;
  let fixture: ComponentFixture<ConfirmDeleteBkcDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteBkcDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteBkcDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
