import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadingstatusComponent } from './downloadingstatus.component';

describe('DownloadingstatusComponent', () => {
  let component: DownloadingstatusComponent;
  let fixture: ComponentFixture<DownloadingstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadingstatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadingstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
