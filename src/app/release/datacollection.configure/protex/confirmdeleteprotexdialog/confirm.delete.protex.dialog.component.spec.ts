import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteProtexDialogComponent } from './confirm.delete.protex.dialog.component';

describe('ChecklistConfirmDialogComponent', () => {
  let component: ConfirmDeleteProtexDialogComponent;
  let fixture: ComponentFixture<ConfirmDeleteProtexDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteProtexDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteProtexDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
