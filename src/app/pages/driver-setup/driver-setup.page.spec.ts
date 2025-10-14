import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DriverSetupPage } from './driver-setup.page';

describe('DriverSetupPage', () => {
  let component: DriverSetupPage;
  let fixture: ComponentFixture<DriverSetupPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverSetupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
