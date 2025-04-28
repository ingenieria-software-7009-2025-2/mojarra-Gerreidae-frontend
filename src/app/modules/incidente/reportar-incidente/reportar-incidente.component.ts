// reportar-incidente.component.ts
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Map, MapStyle, Marker, config } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

@Component({
  selector: 'app-reportar-incidente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reportar-incidente.component.html',
  styleUrls: ['./reportar-incidente.component.css']
})
export class ReportarIncidenteComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  reportForm!: FormGroup;
  map!: Map;
  marker!: Marker;

  private apiKey = 'E2rqKhxKFWqMTrQt5uw2';
  private geocodeUrl = 'https://api.maptiler.com/geocoding/';
  private subs: Subscription | null = null;

  incidentOptions = [
    'Accidente', 'Retraso', 'Obras', 'Policía',
    'Emergencia', 'Tráfico', 'Cierre', 'Otro'
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    config.apiKey = this.apiKey;
    this.initForm();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.subs?.unsubscribe();
  }

  private initForm(): void {
    this.reportForm = this.fb.group({
      address: ['', Validators.required],
      type: ['', Validators.required],
      comment: ['']
    });
  }

  private initMap(): void {
    const center: [number, number] = [-99.184903, 19.321251];
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: MapStyle.STREETS,
      center,
      zoom: 14
    });

    this.marker = new Marker({ draggable: true })
      .setLngLat(center)
      .addTo(this.map);

    this.map.on('click', e => this.onMapClick(e.lngLat.lng, e.lngLat.lat));
    this.marker.on('dragend', () => {
      const { lng, lat } = this.marker.getLngLat();
      this.reverseGeocode(lng, lat);
    });
  }

  private onMapClick(lng: number, lat: number): void {
    this.marker.setLngLat([lng, lat]);
    this.reverseGeocode(lng, lat);
  }

  geocodeAddress(): void {
    const address = this.reportForm.value.address;
    if (!address) return;

    const url = `${this.geocodeUrl}${encodeURIComponent(address)}.json?limit=1&key=${this.apiKey}`;
    this.subs = this.http.get<any>(url).subscribe(res => {
      if (res.features?.length) {
        const [lng, lat] = res.features[0].geometry.coordinates;
        this.map.setCenter([lng, lat]);
        this.marker.setLngLat([lng, lat]);
      }
    });
  }
  private reverseGeocode(lng: number, lat: number): void {
    const url = `${this.geocodeUrl}${lng},${lat}.json?limit=1&key=${this.apiKey}`;
    
    // Cancelamos la suscripción anterior si existe
    if (this.subs) {
      this.subs.unsubscribe();
    }
  
    this.subs = this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res.features?.length) {
          this.reportForm.patchValue({
            address: res.features[0].place_name || res.features[0].properties.label
          });
        }
      },
      error: (err) => {
        console.error('Error en geocodificación inversa:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.reportForm.invalid) return;

    const { address, type, comment } = this.reportForm.value;
    const { lng, lat } = this.marker.getLngLat();
    const payload = { address, type, comment, latitude: lat, longitude: lng };

    console.log('Reporte enviado:', payload);
    // TODO: enviar payload al backend
  }
}
