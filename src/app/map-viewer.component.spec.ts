import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapViewerComponent } from './map-viewer.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Se mockea un div de mapa para evitar fallos de inicialización de Leaflet en el DOM virtual de jsdom
const mapContainer = document.createElement('div');
mapContainer.id = 'map';
document.body.appendChild(mapContainer);

(globalThis as any).L = {
  tileLayer: () => ({ addTo: () => {} }),
  map: () => {
    const m = { setView: () => m, addLayer: () => m, removeLayer: () => m, remove: () => {} };
    return m;
  },
  control: { zoom: () => ({ addTo: () => {} }) },
  latLngBounds: () => ({ extend: () => {}, isValid: () => false })
};

describe('MapViewerComponent', () => {
  let component: MapViewerComponent;
  let fixture: ComponentFixture<MapViewerComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    // Mockeamos el fetch global para prevenir peticiones HTTP reales y evitar que flatgeobuf falle
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false
    } as any);

    // Mockeamos los parámetros de la URL para inicializar el proyecto
    Object.defineProperty(window, 'location', {
      value: { search: '?proyecto=app-buga-buenaventura' },
      writable: true
    });

    await TestBed.configureTestingModule({
      imports: [MapViewerComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MapViewerComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    if ((component as any).map) {
      (component as any).map.remove(); // Limpiar la instancia de Leaflet para la siguiente prueba
    }
    httpMock.verify();
    vi.restoreAllMocks();
  });

  it('debe crear el componente y solicitar metadatos del proyecto', () => {
    expect(component).toBeTruthy();
    expect(component.baseUrl).toContain('app-buga-buenaventura');

    const req = httpMock.expectOne('https://raw.githubusercontent.com/NicolasPlataANI/ani-datos-gis/main/app-buga-buenaventura/info_proyecto.json');
    expect(req.request.method).toBe('GET');
    
    req.flush({
      nombre: { "0": "Proyecto Prueba" },
      longitud: { "0": 120 }
    });

    expect(component.info()?.nombre).toBe('Proyecto Prueba');
    expect(component.info()?.longitud).toBe(120);
  });

  it('debe cambiar correctamente entre el tema claro y oscuro y su mapa base asociado', () => {
    const req = httpMock.expectOne('https://raw.githubusercontent.com/NicolasPlataANI/ani-datos-gis/main/app-buga-buenaventura/info_proyecto.json');
    req.flush({});

    // Estado inicial
    expect(component.isDark()).toBe(true);
    expect(component.mapaBaseActual).toBe('Oscuro');
    
    // Toggle a claro
    component.toggleTema();
    expect(component.isDark()).toBe(false);
    expect(component.mapaBaseActual).toBe('Calles');

    // Toggle de nuevo a oscuro
    component.toggleTema();
    expect(component.isDark()).toBe(true);
    expect(component.mapaBaseActual).toBe('Oscuro');
  });

  it('debe cambiar la visibilidad de las capas usando toggleTodas', () => {
    const req = httpMock.expectOne('https://raw.githubusercontent.com/NicolasPlataANI/ani-datos-gis/main/app-buga-buenaventura/info_proyecto.json');
    req.flush({});

    // Simulamos que la primera capa (Calzadas) tiene elementos para que no esté bloqueada
    component.capasFisicas[0].cantidad = 50;
    component.capasFisicas[0].visible = true;

    // Ejecutamos "Nada" (apagar todas)
    component.toggleTodas(false);
    expect(component.capasFisicas[0].visible).toBe(false);

    // Ejecutamos "Todo" (encender todas)
    component.toggleTodas(true);
    expect(component.capasFisicas[0].visible).toBe(true);
  });
});
