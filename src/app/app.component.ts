import { Component } from '@angular/core';
import { MapViewerComponent } from './map-viewer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MapViewerComponent],
  template: `<app-map-viewer></app-map-viewer>` // Carga directa del mapa
})
export class AppComponent {}