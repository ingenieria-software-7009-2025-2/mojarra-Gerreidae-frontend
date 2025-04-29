import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Map, MapStyle, config, Marker, Popup } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { Router, RouterModule } from '@angular/router';
import { Incidente } from './_model/Incidente';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncidentesService } from './_service/incidentes.service';
import { Subscription } from 'rxjs';
import { SwalMessages } from '../../../shared/swal-messages';
import { AuthService } from '../../usuario/login/_service/auth.service';  // <- Ajusta la ruta si es necesario

@Component({
  selector: 'app-mapa-incidentes',
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './mapa-incidentes.component.html',
  styleUrls: ['./mapa-incidentes.component.css']
})
export class MapaIncidentesComponent implements OnInit, AfterViewInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  private markers: Marker[] = []; 
  swal: SwalMessages = new SwalMessages();

incidentes: Incidente[] = [
  { 
    id_incidente: 1,
    id_usuario: 1,
    descripcion: "Colisión entre dos vehículos en Av. Insurgentes Sur",
    tipo: "Accidente vial",
    estado: "En proceso",
    longitud: -99.168869,
    latitud: 19.346597,
    fecha: new Date('2025-04-26')
  },
  { 
    id_incidente: 2,
    id_usuario: 2,
    descripcion: "Carambola de tres autos en Periférico Sur",
    tipo: "Accidente vial",
    estado: "Activo",
    longitud: -99.227292,
    latitud: 19.300402,
    fecha: new Date('2025-04-25')
  },
  { 
    id_incidente: 3,
    id_usuario: 3,
    descripcion: "Accidente de motocicleta en Reforma",
    tipo: "Accidente vial",
    estado: "Pendiente",
    longitud: -99.174839,
    latitud: 19.435144,
    fecha: new Date('2025-04-24')
  },
  { 
    id_incidente: 4,
    id_usuario: 4,
    descripcion: "Choque contra poste en Tlalpan",
    tipo: "Accidente vial",
    estado: "Controlado",
    longitud: -99.144613,
    latitud: 19.283838,
    fecha: new Date('2025-04-23')
  },
  { 
    id_incidente: 5,
    id_usuario: 5,
    descripcion: "Vehículo volcado en Viaducto Tlalpan",
    tipo: "Accidente vial",
    estado: "Resuelto",
    longitud: -99.159328,
    latitud: 19.268089,
    fecha: new Date('2025-04-22')
  },
  { 
    id_incidente: 6,
    id_usuario: 6,
    descripcion: "Accidente múltiple cerca del Zócalo",
    tipo: "Accidente vial",
    estado: "En proceso",
    longitud: -99.133208,
    latitud: 19.432607,
    fecha: new Date('2025-04-21')
  },
  { 
    id_incidente: 7,
    id_usuario: 7,
    descripcion: "Frenado brusco provoca choque en División del Norte",
    tipo: "Accidente vial",
    estado: "Activo",
    longitud: -99.162163,
    latitud: 19.361428,
    fecha: new Date('2025-04-20')
  },
  { 
    id_incidente: 8,
    id_usuario: 8,
    descripcion: "Camión de carga accidentado en Polanco",
    tipo: "Accidente vial",
    estado: "Controlado",
    longitud: -99.201416,
    latitud: 19.432608,
    fecha: new Date('2025-04-19')
  },
  { 
    id_incidente: 9,
    id_usuario: 9,
    descripcion: "Taxi impactado en Calzada de Tlalpan",
    tipo: "Accidente vial",
    estado: "Pendiente",
    longitud: -99.142344,
    latitud: 19.379123,
    fecha: new Date('2025-04-18')
  },
  { 
    id_incidente: 10,
    id_usuario: 10,
    descripcion: "Atropellamiento en Av. Universidad",
    tipo: "Accidente vial",
    estado: "En proceso",
    longitud: -99.187325,
    latitud: 19.345678,
    fecha: new Date('2025-04-17')
  }
];

  map: Map | undefined;
  openIncidentes = new Set<Incidente>();
  selectedIncidente: Incidente | null = null;
  filteredIncidentes: Incidente[] = [];
  filterTipo: string = 'todos';

  // Icon mapping
  private iconMap: { [key: string]: { icon: string, color: string } } = {
    'Accidente vial': { icon: 'car-crash', color: '#FF5252' },
    'Incendio': { icon: 'fire', color: '#FF7043' },
    'Manifestación': { icon: 'users', color: '#42A5F5' },
    'Servicios públicos': { icon: 'tint', color: '#26C6DA' },
    'Bache': { icon: 'exclamation-circle', color: '#9E9E9E' },
    'Luminaria Descompuesta': { icon: 'lightbulb', color: '#e3972d'},
    'Obstáculo en vía pública': { icon: 'road-barrier', color: '#e34f2d'}
  };

  constructor(
    private incidenteService: IncidentesService,
    private router: Router,
    private authService: AuthService
  ) { }
  
  @ViewChild('map') private mapContainer!: ElementRef<HTMLElement>;

  ngOnInit(): void {
    config.apiKey = 'E2rqKhxKFWqMTrQt5uw2';
    this.filteredIncidentes = [...this.incidentes];
    this.getIncidentes();
  }

  ngAfterViewInit() {
    const initialState = { longitud: -99.184903, latitud: 19.321251, zoom: 14 };
    
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: MapStyle.STREETS,
      center: [initialState.longitud, initialState.latitud],
      zoom: initialState.zoom
    });

    this.map.on('load', () => {
      this.addMarkersToMap();
    });
  }

  ngOnDestroy() {
    this.clearMarkers();
    this.map?.remove();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getIncidentes() {
    this.subscriptions.push(
      this.incidenteService.getIncidentes().subscribe({
        next: (v) => {
          if (v.body) {
            this.incidentes = v.body;
            this.filteredIncidentes = [...this.incidentes];
            if (this.map) {
              this.addMarkersToMap();
            }
          }
        },
        error: (e) => {
          console.log(e);
        }
      })
    );
  }

  private addMarkersToMap(): void {
    this.clearMarkers();
    
    this.filteredIncidentes.forEach(incidente => {
      if (this.map && incidente.latitud && incidente.longitud) {
        const iconInfo = this.iconMap[incidente.tipo] || this.iconMap['default'];
        
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        markerElement.innerHTML = `
          <div class="marker-icon" style="background-color: ${iconInfo.color}">
            <i class="fas fa-${iconInfo.icon}"></i>
          </div>
          <div class="marker-pulse"></div>
        `;

        const popup = new Popup({ offset: 25 })
          .setHTML(`
            <div class="incidente-popup">
              <h4>${incidente.tipo}</h4>
              <p>${incidente.descripcion}</p>
              <div class="popup-footer">
                <span class="estado-badge ${incidente.estado.toLowerCase().replace(' ', '-')}">
                  ${incidente.estado}
                </span>
                <span class="fecha">${incidente.fecha.toLocaleString()}</span>
              </div>
            </div>
          `);

        const marker = new Marker({ element: markerElement })
          .setLngLat([incidente.longitud, incidente.latitud])
          .setPopup(popup)
          .addTo(this.map!);

        marker.getElement().addEventListener('click', () => {
          this.selectIncidente(incidente);
        });

        this.markers.push(marker);
      }
    });
  }

  private clearMarkers(): void {
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
  }

  selectIncidente(incidente: Incidente): void {
    this.selectedIncidente = incidente;
    this.clearMarkers();
    
    if (this.map && incidente.latitud && incidente.longitud) {
      const iconInfo = this.iconMap[incidente.tipo] || this.iconMap['default'];
      
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker selected';
      markerElement.innerHTML = `
        <div class="marker-icon" style="background-color: ${iconInfo.color}">
          <i class="fas fa-${iconInfo.icon}"></i>
        </div>
        <div class="marker-pulse"></div>
      `;

      const marker = new Marker({ element: markerElement })
        .setLngLat([incidente.longitud, incidente.latitud])
        .addTo(this.map);

      this.markers.push(marker);
      
      this.map.flyTo({
        center: [incidente.longitud, incidente.latitud],
        zoom: 16,
        essential: true
      });
    }
  }

  toggleIncidente(incidente: Incidente, event: Event): void {
    event.stopPropagation();
    if (this.openIncidentes.has(incidente)) {
      this.openIncidentes.delete(incidente);
    } else {
      this.openIncidentes.add(incidente);
    }
  }

  onIncidenteClick(incidente: Incidente): void {
    this.selectIncidente(incidente);
  }

  filterByType(type: string): void {
    this.filterTipo = type;
    this.selectedIncidente = null; 
    if (type === 'todos') {
      this.filteredIncidentes = [...this.incidentes];
    } else {
      this.filteredIncidentes = this.incidentes.filter(i => i.tipo === type);
    }
    this.addMarkersToMap();
  }
  
  getIncidenteIcon(tipo: string): string {
    return this.iconMap[tipo]?.icon || this.iconMap['default'].icon;
  }

  getIncidenteColor(tipo: string): string {
    return this.iconMap[tipo]?.color || this.iconMap['default'].color;
  }

  getSeverityClass(nivelGravedad: string): string {
    return nivelGravedad.toLowerCase().replace(' ', '-');
  }
  reportarNuevoIncidente(): void {
    if (!this.authService.isUserLoggedIn()) {
      this.swal.errorMessage('Debes iniciar sesión para reportar un incidente');
  
      // Espera un momento antes de redirigir
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);  // espera 2 segundos para que vea el mensaje
      return;
    }
  
    this.router.navigate(['/report']);
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