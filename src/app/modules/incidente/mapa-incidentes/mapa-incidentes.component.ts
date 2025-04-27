import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Map, MapStyle, config } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { Incidente } from './_model/Incidente';
import { CommonModule } from '@angular/common';
import { IncidentesService } from './_service/incidentes.service';
import { Subscription } from 'rxjs';
import { SwalMessages } from '../../../shared/swal-messages';

@Component({
  selector: 'app-mapa-incidentes',
  imports: [CommonModule],
  templateUrl: './mapa-incidentes.component.html',
  styleUrl: './mapa-incidentes.component.css'
})
export class MapaIncidentesComponent implements OnInit, AfterViewInit, OnDestroy{
  /**
  * Suscripciones activas en el componente.
  */
  private subscriptions: Subscription[] = [];
  swal: SwalMessages = new SwalMessages(); // swal messages
  incidentes: Incidente[] = [
    { lng: 0, lat: 0, descripcion: "prueba para visualizar",
      tipo: "prueba", estado: "para probar el display",
      fecha: new Date()
    }]; // lista de incidentes a mostrar
  map: Map | undefined;
  openIncidentes = new Set<Incidente>();

  constructor(
    private incidenteService: IncidentesService
  ){ }

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  ngOnInit(): void {
    config.apiKey = 'E2rqKhxKFWqMTrQt5uw2';
  }

  ngAfterViewInit() {
    const initialState = { lng: -99.184903, lat: 19.321251, zoom: 14 };
  
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: MapStyle.STREETS,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });

    this.map.on('click', (e) => {
      console.log('Map clicked!', e);
    });
  }

  ngOnDestroy() {
    this.map?.remove();
  }

  getIncidentes(){
    this.subscriptions.push(
      this.incidenteService.getIncidentes().subscribe({
        next: (v) => {
          if (v.body) {
            this.incidentes = v.body;
          }
        },
        error: (e) => {
          console.log(e);
        }
      })
    );
  }

  toggleIncidente(incidente: Incidente): void {
    if (this.openIncidentes.has(incidente)) {
      this.openIncidentes.delete(incidente);
    } else {
      this.openIncidentes.add(incidente);
    }
  }
  
  onEditar(incidente: Incidente): void {
    // Aquí la lógica para editar
    console.log('Editar', incidente);
  }
  
  onEliminar(incidente: Incidente): void {
    // Aquí la lógica para eliminar
    console.log('Eliminar', incidente);
  }
}
