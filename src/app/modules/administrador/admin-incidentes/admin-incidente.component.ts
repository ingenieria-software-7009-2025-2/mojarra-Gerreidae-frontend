import { Component, OnInit } from '@angular/core';
import { AdminIncidenteService } from './_service/adminIncidente.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'


@Component({
  standalone: true,
  imports: [RouterModule, CommonModule],
  selector: 'app-admin-incidente',
  templateUrl: './admin-incidente.component.html',
  styleUrls: ['./admin-incidente.component.css']
})
export class AdminIncidenteComponent implements OnInit {
  incidentes: any[] = [];

  constructor(
    private adminIncidenteService: AdminIncidenteService
  ) {}

  ngOnInit() {
      this.adminIncidenteService.getAllIncidentes().subscribe({
        next: (data) => {
          console.log('Datos de incidentes:', data);
          this.incidentes = data;
        },
        error: (error) => {
          console.error('Error al obtener incidentes:', error);
        }
      });
    }

}

