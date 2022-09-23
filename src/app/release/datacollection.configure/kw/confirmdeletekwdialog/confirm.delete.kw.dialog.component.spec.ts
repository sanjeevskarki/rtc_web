import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteKwDialogComponent } from './confirm.delete.kw.dialog.component';

describe('ChecklistConfirmDialogComponent', () => {
  let component: ConfirmDeleteKwDialogComponent;
  let fixture: ComponentFixture<ConfirmDeleteKwDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteKwDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteKwDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
