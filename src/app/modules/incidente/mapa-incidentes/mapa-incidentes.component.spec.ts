import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaIncidentesComponent } from './mapa-incidentes.component';

describe('MapaIncidentesComponent', () => {
  let component: MapaIncidentesComponent;
  let fixture: ComponentFixture<MapaIncidentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapaIncidentesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaIncidentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
