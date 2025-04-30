import { Component, OnInit } from '@angular/core';
import { AdminIncidenteService } from './_service/adminIncidente.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'
import { SwalMessages } from '../../../shared/swal-messages';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HashResponse } from '../../incidente/mapa-incidentes/_model/HashResponse';
import { IncidentesService } from '../../incidente/mapa-incidentes/_service/incidentes.service';
import { IncidenteDTO } from '../../incidente/mapa-incidentes/_model/IncidenteDTO';



@Component({
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  selector: 'app-admin-incidente',
  templateUrl: './admin-incidente.component.html',
  styleUrls: ['./admin-incidente.component.css']
})
export class AdminIncidenteComponent implements OnInit {
  incidentes: IncidenteDTO[] = [];
  swal: SwalMessages = new SwalMessages(); // swal messages
  incidentesFiltrados: IncidenteDTO[] = [];
  private subscriptions: Subscription[] = [];

    // Para filtrar por estado y tipo
    filtroTipo: string = '';
    filtroEstado: string = '';
    estados: HashResponse = {};
    tipos:HashResponse = {};
    tiposDisponibles: string[] = [];
    estadosDisponibles: string[] = [];

    constructor(
      private adminIncidenteService: AdminIncidenteService,
      private incidenteService: IncidentesService
    ) { }

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
      this.getTipos();
      this.getEstados();
    }

    aplicarFiltros() {
      this.incidentesFiltrados = this.incidentes.filter(incidente => {
        const coincideTipo = this.filtroTipo ? this.tipos[incidente.tipo] === this.filtroTipo : true;
        const coincideEstado = this.filtroEstado ? this.estados[incidente.estado] === this.filtroEstado : true;
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

  getEstados() {
    this.subscriptions.push(
      this.incidenteService.getEstados().subscribe({
        next: (v) => {
          if (v.body) {
            this.estados = v.body;
            this.estadosDisponibles = Object.values(this.estados);
          }
        },
        error: (e) => {
          console.log(e);
        }
      })
    );
  }

  getTipos() {
    this.subscriptions.push(
      this.incidenteService.getTipos().subscribe({
        next: (v) => {
          if (v.body) {
            this.tipos = v.body;
            this.tiposDisponibles = Object.values(this.tipos);
          }
        },
        error: (e) => {
          console.log(e);
        }
      })
    );
  }
}

