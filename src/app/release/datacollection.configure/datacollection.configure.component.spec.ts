import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatacollectionConfigureComponent } from './datacollection.configure.component';

describe('Datacollection.ConfigureComponent', () => {
  let component: DatacollectionConfigureComponent;
  let fixture: ComponentFixture<DatacollectionConfigureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatacollectionConfigureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatacollectionConfigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
