import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare const google: any;

@Component({
  selector: 'app-report-incident',
  templateUrl: './report-incident.component.html',
  styleUrls: ['./report-incident.component.scss']
})
export class ReportarIncidenteComponent implements OnInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  map!: any;
  marker!: any;
  geocoder!: any;

  reportForm!: FormGroup;
  incidentOptions = [
    'Accidente', 'Retraso', 'Obras', 'Policía',
    'Emergencia', 'Tráfico', 'Cierre', 'Otro'
  ];
  selectedFile!: File|null;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // 1) Inicializa el formulario
    this.reportForm = this.fb.group({
      address: ['', Validators.required],
      type: ['', Validators.required],
      comment: ['']
    });

    // 2) Carga el mapa
    this.initMap();
  }

  initMap() {
    const center = { lat: 19.432608, lng: -99.133209 };  // CDMX por defecto
    this.map = new google.maps.Map(this.mapContainer.nativeElement, {
      center,
      zoom: 14
    });
    this.geocoder = new google.maps.Geocoder();
    this.marker = new google.maps.Marker({
      map: this.map,
      draggable: true
    });

    // Click en el mapa → geocode latlng → llenar dirección y mover marcador
    this.map.addListener('click', (e: any) => {
      const latlng = e.latLng;
      this.marker.setPosition(latlng);
      this.geocoder.geocode({ location: latlng }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          this.reportForm.patchValue({ address: results[0].formatted_address });
        }
      });
    });

    // Al arrastrar el marcador → actualizar dirección
    this.marker.addListener('dragend', () => {
      const pos = this.marker.getPosition();
      this.geocoder.geocode({ location: pos }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          this.reportForm.patchValue({ address: results[0].formatted_address });
        }
      });
    });
  }

  geocodeAddress() {
    const address = this.reportForm.value.address;
    if (!address) return;
    this.geocoder.geocode({ address }, (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        const loc = results[0].geometry.location;
        this.map.setCenter(loc);
        this.marker.setPosition(loc);
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }

  onSubmit() {
    if (this.reportForm.invalid) return;

    const { address, type, comment } = this.reportForm.value;
    const position = this.marker.getPosition();
    const payload = new FormData();
    payload.append('address', address);
    payload.append('type', type);
    payload.append('latitude', position.lat());
    payload.append('longitude', position.lng());
    payload.append('comment', comment);
    if (this.selectedFile) {
      payload.append('image', this.selectedFile);
    }

    // Aquí haz tu POST al backend:
    // this.http.post('/api/incidentes', payload).subscribe(...)
    console.log('Enviando reporte:', payload);
  }
}
