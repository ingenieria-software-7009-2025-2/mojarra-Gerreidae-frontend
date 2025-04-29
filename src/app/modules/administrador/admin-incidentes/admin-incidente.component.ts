import { Component, OnInit } from '@angular/core';
import { AdminIncidenteService } from './_service/adminIncidente.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'
import { SwalMessages } from '../../../shared/swal-messages';


@Component({
  standalone: true,
  imports: [RouterModule, CommonModule],
  selector: 'app-admin-incidente',
  templateUrl: './admin-incidente.component.html',
  styleUrls: ['./admin-incidente.component.css']
})
export class AdminIncidenteComponent implements OnInit {
  incidentes: any[] = [];
  swal: SwalMessages = new SwalMessages(); // swal messages

  constructor(
    private adminIncidenteService: AdminIncidenteService
  ) {}

  ngOnInit() {
      this.cargarIncidentes();
    }

    cargarIncidentes() {
      this.adminIncidenteService.getAllIncidentes().subscribe({
        next: (data) => {
          console.log('Datos de incidentes:', data);
          this.incidentes = data;
        },
        error: (error) => {
          console.error('Error al cargar incidentes:', error);
        }
      });
    }

  onDeleteIncidente(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este incidente?')) {
      this.adminIncidenteService.deleteIncidente(id).subscribe({
        next: () => {
          //alert('Incidente eliminado exitosamente.');
          this.swal.successMessage('Incidente eliminado exitosamente.');
          this.cargarIncidentes();
        },
        error: (error) => {
          console.error('Error al eliminar incidente:', error);
          this.swal.errorMessage('Hubo un error al intentar eliminar el incidente.');
        }
      });
    }
}
}

