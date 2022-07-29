import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseEditComponent } from './release.edit.component';

describe('Release.EditComponent', () => {
  let component: ReleaseEditComponent;
  let fixture: ComponentFixture<ReleaseEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReleaseEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
