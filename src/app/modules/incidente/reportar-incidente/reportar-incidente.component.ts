import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Map, MapStyle, Marker, config } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { mjs_api_uri } from '../../../shared/mjs-api-uri';
import { SwalMessages } from '../../../shared/swal-messages';
import { AuthService } from '../../usuario/login/_service/auth.service';
import { HashResponse } from '../mapa-incidentes/_model/HashResponse';
import { IncidentesService } from '../mapa-incidentes/_service/incidentes.service';

@Component({
  selector: 'app-reportar-incidente',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule
  ],
  templateUrl: './reportar-incidente.component.html',
  styleUrls: ['./reportar-incidente.component.css']
})
export class ReportarIncidenteComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  private subscriptions: Subscription[] = [];
  reportForm!: FormGroup;
  map!: Map;
  marker!: Marker;
  private subs: Subscription | null = null;

  selectedImages: string[] = [];
  maxImages = 3;

  private apiKey = 'E2rqKhxKFWqMTrQt5uw2';
  private geocodeUrl = 'https://api.maptiler.com/geocoding';

  tipos:HashResponse = {};
  incidentOptions: string[]  = [];

  swal = new SwalMessages();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private zone: NgZone,
    private authService: AuthService,
    private incidenteService: IncidentesService
  ) {}
  

  ngOnInit(): void {
    config.apiKey = this.apiKey;
    this.initForm();
    this.getTipos();
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
      address:  ['', Validators.required],
      latitud:  [null, Validators.required],
      longitud: [null, Validators.required],
      type:     ['', Validators.required],
      comment:  [''],
      images:   [[]]
    });
  }

  private initMap(): void {
    const center: [number, number] = [-99.184903, 19.321251];
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style:     MapStyle.STREETS,
      center,
      zoom:      14
    });

    this.marker = new Marker({ draggable: true })
      .setLngLat(center)
      .addTo(this.map);

    this.map.on('click', (e: any) => {
      const { lng, lat } = e.lngLat;
      this.onMapClick(lng, lat);
    });

    this.marker.on('dragend', () => {
      const { lng, lat } = this.marker.getLngLat();
      this.onMapClick(lng, lat);
    });
  }

  private onMapClick(lng: number, lat: number): void {
    this.marker.setLngLat([lng, lat]);
    this.zone.run(() => {
      this.reportForm.patchValue({ longitud: lng, latitud: lat });
    });
    this.reverseGeocode(lng, lat);
  }

  geocodeAddress(): void {
    const address = this.reportForm.value.address;
    if (!address) return;

    const url = `${this.geocodeUrl}${encodeURIComponent(address)}.json?limit=1&key=${this.apiKey}`;
    this.subs = this.http.get<any>(url).subscribe(res => {
      if (res.features?.length) {
        const [lng, lat] = res.features[0].geometry.coordinates;
        this.zone.run(() => {
          this.map.setCenter([lng, lat]);
          this.marker.setLngLat([lng, lat]);
          this.reportForm.patchValue({ longitud: lng, latitud: lat });
        });
      }
    });
  }

  private reverseGeocode(lng: number, lat: number): void {
    const url = 
      `${this.geocodeUrl}/${lng},${lat}.json` +
      `?key=${this.apiKey}&limit=1`;
  
    this.subs = this.http.get<any>(url).subscribe({
      next: res => {
        // MapTiler devuelve un objeto GeoJSON con features[]
        if (res.features?.length) {
          const feat     = res.features[0];
          const address  = feat.place_name;  // la dirección legible
          console.log('reverseGeocode success', feat);
  
          this.zone.run(() => {
            this.reportForm.patchValue({ address });
          });
        }
      },
      error: err => {
        console.error('Error en reverseGeocode:', err);
        this.zone.run(() => {
          this.swal.errorMessage('No se pudo obtener la dirección.');
        });
      }
    });
  }

  getTipos() {
    this.subscriptions.push(
      this.incidenteService.getTipos().subscribe({
        next: (v) => {
          if (v.body) {
            this.tipos = v.body;
            this.incidentOptions = Object.values(this.tipos);
          }
        },
        error: (e) => {
          console.log(e);
        }
      })
    );
  }

  onImageSelected(event: any): void {
    const files: FileList = event.target.files;
    const remaining = this.maxImages - (this.reportForm.value.images?.length || 0);
    const toProcess = Math.min(remaining, files.length);
    for (let i = 0; i < toProcess; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const fullDataUrl: string = e.target.result;
        const base64Data = fullDataUrl.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
      
        const images = this.reportForm.value.images || [];
      
        // Guardar un objeto que tenga ambas partes
        const newImage = {
          preview: fullDataUrl,   // Para mostrar en <img src="...">
          data: base64Data        // Para enviar al backend
        };
      
        const updatedImages = [...images, newImage];
      
        this.zone.run(() => this.reportForm.patchValue({ images: updatedImages }));
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(idx: number): void {
    const imgs = [...(this.reportForm.value.images || [])];
    imgs.splice(idx, 1);
    this.reportForm.patchValue({ images: imgs });
  }

  /**
   * Envía el formulario al endpoint POST /v1/incident
   */
  onSubmit(): void {
    if (this.reportForm.invalid) {
      this.swal.errorMessage('Revisa que todos los campos obligatorios estén completos.');
      return;
    }

    if (!this.authService.isUserLoggedIn()) {
      this.swal.errorMessage('Debes iniciar sesión primero.');
      return;
    }

    // Construye el payload EXACTO que tu controlador espera
    const { type, comment, latitud, longitud, images } = this.reportForm.value;
    const payload = {
      descripcion: comment,
      tipo:        type,
      estado:      'Reportado',
      latitud,
      longitud,
      imagenes:    (images || []).map((img: any) => img.data) // Solo base64
    };

    this.incidenteService.postIncidente(payload).subscribe({
        next: () => {
          this.swal.successMessage('Incidente creado correctamente.');
          this.reportForm.reset();
          this.selectedImages = [];
        },
        error: (err) => {
          console.error('Error creando incidente', err);
          this.swal.errorMessage('No se pudo crear el incidente. Intenta de nuevo.');
        }
      });
  }
}
