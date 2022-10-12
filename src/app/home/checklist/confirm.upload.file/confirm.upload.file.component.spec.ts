import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmUploadFileComponent } from './confirm.upload.file.component';

describe('ConfirmReleaseStatusComponent', () => {
  let component: ConfirmUploadFileComponent;
  let fixture: ComponentFixture<ConfirmUploadFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmUploadFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmUploadFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
