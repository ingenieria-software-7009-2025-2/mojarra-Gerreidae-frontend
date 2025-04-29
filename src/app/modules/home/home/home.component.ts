import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Map, MapStyle, config } from '@maptiler/sdk';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  ngOnInit(): void {
    config.apiKey = 'E2rqKhxKFWqMTrQt5uw2';  // Tu clave de API
  }

  ngAfterViewInit() {
    const map = new Map({
      container: 'map-preview', // Referencia al contenedor
      style: MapStyle.STREETS,
      center: [-99.184903, 19.321251], // Coordenadas de la vista inicial
      zoom: 12,
    });
  }
}
