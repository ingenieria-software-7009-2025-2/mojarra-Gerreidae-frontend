import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminIncidentesComponent } from './admin-incidentes.component';

describe('AdminIncidentesComponent', () => {
  let component: AdminIncidentesComponent;
  let fixture: ComponentFixture<AdminIncidentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminIncidentesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminIncidentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
