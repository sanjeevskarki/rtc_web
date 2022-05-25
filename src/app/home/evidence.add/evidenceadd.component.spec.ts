import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidenceAddComponent } from './evidenceadd.component';

describe('Evidence.AddComponent', () => {
  let component: EvidenceAddComponent;
  let fixture: ComponentFixture<EvidenceAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvidenceAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidenceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
