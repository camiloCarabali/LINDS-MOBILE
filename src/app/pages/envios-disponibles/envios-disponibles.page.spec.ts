import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnviosDisponiblesPage } from './envios-disponibles.page';

describe('EnviosDisponiblesPage', () => {
  let component: EnviosDisponiblesPage;
  let fixture: ComponentFixture<EnviosDisponiblesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EnviosDisponiblesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
