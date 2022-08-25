import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseStakeholderComponent } from './release.stakeholder.component';

describe('ReleaseStakeholderComponent', () => {
  let component: ReleaseStakeholderComponent;
  let fixture: ComponentFixture<ReleaseStakeholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReleaseStakeholderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseStakeholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
