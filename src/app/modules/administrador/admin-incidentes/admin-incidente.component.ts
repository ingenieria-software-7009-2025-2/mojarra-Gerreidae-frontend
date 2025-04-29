import { Component, OnInit } from '@angular/core';
import { AdminIncidenteService } from './_service/adminIncidente.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'
import { SwalMessages } from '../../../shared/swal-messages';
import { FormsModule } from '@angular/forms';



@Component({
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  selector: 'app-admin-incidente',
  templateUrl: './admin-incidente.component.html',
  styleUrls: ['./admin-incidente.component.css']
})
export class AdminIncidenteComponent implements OnInit {
  incidentes: any[] = [];
  swal: SwalMessages = new SwalMessages(); // swal messages
  incidentesFiltrados: any[] = [];

    // Para filtrar por estado y tipo
    filtroTipo: string = '';
    filtroEstado: string = '';
    tiposDisponibles: string[] = [];
    estadosDisponibles: string[] = [];

    constructor(private adminIncidenteService: AdminIncidenteService) { }

    ngOnInit() {
      this.cargarIncidentes();
    }

    cargarIncidentes() {
      this.adminIncidenteService.getAllIncidentes().subscribe({
        next: (data) => {
          this.incidentes = data;
          this.incidentesFiltrados = data;
          this.cargarFiltrosDisponibles();
        },
        error: (error) => {
          console.error('Error al cargar incidentes:', error);
        }
      });
    }

    cargarFiltrosDisponibles() {
      // Extraer los tipos y estados únicos
      this.tiposDisponibles = [...new Set(this.incidentes.map(incidente => incidente.tipo))];
      this.estadosDisponibles = [...new Set(this.incidentes.map(incidente => incidente.estado))];
    }

    aplicarFiltros() {
      this.incidentesFiltrados = this.incidentes.filter(incidente => {
        const coincideTipo = this.filtroTipo ? incidente.tipo === this.filtroTipo : true;
        const coincideEstado = this.filtroEstado ? incidente.estado === this.filtroEstado : true;
        return coincideTipo && coincideEstado;
      });
    }

/**
 * Función para eliminar un incidente
 */
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

