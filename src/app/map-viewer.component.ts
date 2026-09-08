import { Component, OnInit, AfterViewInit, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DecimalPipe } from '@angular/common';
import { catchError, of } from 'rxjs';
import * as fgb from 'flatgeobuf';
import { Title } from '@angular/platform-browser';

declare const L: any;

@Component({
  selector: 'app-map-viewer',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  template: `
    <div [style.backgroundColor]="isDark() ? '#121212' : '#FFF9C4'" 
         [style.color]="isDark() ? '#e2e8f0' : '#1e293b'"
         class="h-screen w-full relative overflow-hidden font-sans flex flex-col transition-colors duration-300">

      @if (cargando()) {
        <div [style.backgroundColor]="isDark() ? '#121212' : '#FFF9C4'" class="absolute inset-0 z-[100] flex flex-col items-center justify-center">
          <div class="w-16 h-16 border-4 border-zinc-500 border-t-yellow-500 rounded-full animate-spin"></div>
          <p class="mt-4 font-bold tracking-widest uppercase opacity-70">Cargando...</p>
        </div>
      }

      <div class="flex-1 flex w-full h-full relative">
        <div id="map" class="w-full h-full bg-slate-900 z-0"></div>
        
        <div class="absolute top-6 left-6 z-10 w-96 flex flex-col gap-4 pointer-events-none">
          <div [style.backgroundColor]="isDark() ? 'rgba(18,18,18,0.85)' : 'rgba(255,249,196,0.9)'" 
               class="backdrop-blur-md p-8 rounded-2xl border border-zinc-500/20 shadow-2xl pointer-events-auto transition-colors duration-300">
            <div class="flex justify-between items-start mb-6">
              <div class="flex items-center gap-4">
                <img src="logoani.png" alt="ANI" class="h-12 object-contain">
              </div>
              <button (click)="toggleTema()" class="text-2xl hover:scale-110 transition-transform bg-white/5 p-2 rounded-xl">
                {{ isDark() ? '🌞' : '🌚' }}
              </button>
            </div>
            
            <p class="text-[10px] font-black tracking-[0.2em] uppercase text-yellow-500 mb-1">Proyecto ANI</p>
            <h1 class="text-2xl font-black uppercase leading-tight mb-8">{{ info()?.nombre || '---' }}</h1>

            <div class="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p class="text-[9px] uppercase tracking-widest opacity-50 mb-1 font-bold">Modo</p>
                <p class="font-medium text-sm">{{ info()?.modo || '---' }}</p>
              </div>
              <div>
                <p class="text-[9px] uppercase tracking-widest opacity-50 mb-1 font-bold">Etapa</p>
                <p class="font-medium text-sm">{{ info()?.etapa || '---' }}</p>
              </div>
              <div>
                <p class="text-[9px] uppercase tracking-widest opacity-50 mb-1 font-bold">Longitud</p>
                <p class="font-bold text-lg font-mono">{{ info()?.longitud || 0 }} <span class="text-xs font-sans opacity-50">km</span></p>
              </div>
              <div>
                <p class="text-[9px] uppercase tracking-widest opacity-50 mb-1 font-bold">Mes</p>
                <p class="font-medium text-sm capitalize">{{ info()?.mesAvance || '---' }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="absolute top-6 right-6 z-10 w-72 flex flex-col gap-4 pointer-events-none">
          <button (click)="recentrar()" 
                  [style.backgroundColor]="isDark() ? 'rgba(39,39,42,0.9)' : 'rgba(255,255,255,0.9)'"
                  class="w-full py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-yellow-500 transition-all shadow-xl border border-zinc-500/20 backdrop-blur-md pointer-events-auto"
                  [style.color]="isDark() ? '#e2e8f0' : '#1e293b'">
            📍 Recentrar Mapa
          </button>

          <div [style.backgroundColor]="isDark() ? 'rgba(18,18,18,0.85)' : 'rgba(255,249,196,0.9)'" 
               class="backdrop-blur-md p-6 rounded-2xl border border-zinc-500/20 shadow-2xl pointer-events-auto transition-colors duration-300">
            <p class="text-[10px] font-black tracking-[0.2em] uppercase opacity-50 mb-4">Mapa Base</p>
            <div class="flex gap-2 bg-zinc-500/10 p-1 rounded-xl">
              @for (mapa of ['Oscuro', 'Satélite', 'Calles']; track mapa) {
                <button (click)="cambiarBase(mapa)" 
                        [class.bg-yellow-500]="mapaBaseActual === mapa"
                        [class.text-black]="mapaBaseActual === mapa"
                        class="flex-1 py-2 rounded-lg text-xs font-bold transition-all">
                  {{ mapa }}
                </button>
              }
            </div>
          </div>

          <div [style.backgroundColor]="isDark() ? 'rgba(18,18,18,0.85)' : 'rgba(255,249,196,0.9)'" 
               class="backdrop-blur-md flex-1 overflow-hidden flex flex-col rounded-2xl border border-zinc-500/20 shadow-2xl pointer-events-auto transition-colors duration-300 max-h-[400px]">
            
            <div class="p-6 border-b border-zinc-500/20 flex justify-between items-center bg-zinc-500/5">
              <p class="text-[10px] font-black tracking-[0.2em] uppercase opacity-80">Inventario ({{ totalActivos | number }})</p>
              <div class="flex gap-2">
                <button (click)="toggleTodas(true)" class="text-[9px] font-bold uppercase hover:text-yellow-500 bg-white/5 px-2 py-1 rounded">Todo</button>
                <button (click)="toggleTodas(false)" class="text-[9px] font-bold uppercase hover:text-yellow-500 bg-white/5 px-2 py-1 rounded">Nada</button>
              </div>
            </div>

            <div class="overflow-y-auto p-4 flex-1 custom-scrollbar">
              <div class="flex flex-col gap-1">
                @for (capa of capasFisicas; track capa.nombre) {
                  <label class="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl cursor-pointer transition-colors group">
                    <div class="flex items-center gap-3">
                      <div class="w-3 h-3 rounded-full shadow-sm" [style.backgroundColor]="capa.color"></div>
                      <div>
                        <span class="text-sm font-bold block truncate max-w-[120px]" [title]="capa.nombre">{{ capa.nombre }}</span>
                        <span class="text-[10px] opacity-50 font-mono">{{ capa.cantidad | number }} pts</span>
                      </div>
                    </div>
                    <div class="relative flex items-center">
                      <input type="checkbox" 
                             [checked]="capa.visible" 
                             (change)="toggleCapa(capa)" 
                             class="peer appearance-none w-5 h-5 rounded border-2 border-zinc-500/30 checked:bg-yellow-500 checked:border-yellow-500 transition-colors cursor-pointer" [disabled]="capa.cantidad === 0">
                    </div>
                  </label>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full transition-all duration-500 ease-in-out relative flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.3)] z-20"
           [style.backgroundColor]="isDark() ? '#18181b' : '#fef08a'"
           [style.height]="graficaExpandida() ? '45vh' : '45px'">
        
        <button (click)="graficaExpandida.set(!graficaExpandida())" 
                class="absolute right-6 -top-10 text-xs font-bold uppercase px-6 py-3 rounded-t-2xl shadow-xl hover:brightness-110 transition-all flex items-center gap-2"
                [style.backgroundColor]="isDark() ? '#18181b' : '#fef08a'"
                [style.color]="isDark() ? '#e2e8f0' : '#1e293b'">
          {{ graficaExpandida() ? 'Ocultar Resumen' : 'Ver Resumen KPI' }}
        </button>

        <div class="flex-1 p-6 overflow-y-auto custom-scrollbar transition-opacity duration-300" [class.opacity-0]="!graficaExpandida()" [class.opacity-100]="graficaExpandida()">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            @for (capa of capasFisicasOrdenadas(); track capa.nombre) {
              <div class="rounded-2xl p-5 border shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-all duration-300"
                   [style.backgroundColor]="isDark() ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'"
                   [style.borderColor]="isDark() ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'">
                
                <div class="absolute top-0 left-0 w-full h-1" [style.backgroundColor]="capa.color"></div>
                <div class="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500" [style.backgroundColor]="capa.color"></div>
                
                <div class="relative z-10 flex flex-col h-full justify-between gap-4">
                  <h3 class="text-[11px] font-bold uppercase tracking-widest leading-tight opacity-70">{{ capa.nombre }}</h3>
                  <div>
                    <p class="text-3xl font-black tabular-nums tracking-tight" [style.color]="isDark() ? capa.color : '#1e293b'">
                      {{ capa.cantidad | number }}
                    </p>
                    <p class="text-[9px] uppercase font-bold opacity-50 mt-1">Elementos</p>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #666; border-radius: 4px; }
  `]
})
export class MapViewerComponent implements OnInit, AfterViewInit {
  cargando = signal(true); 
  graficaExpandida = signal(false);
  isDark = signal(true); 
  info = signal<any>(null);
  
  private map!: any;
  baseUrl = '';
  private initialBounds: any = null;
  
  totalActivos = 0;
  
  capasFisicasOrdenadas = computed(() => {
    return [...this.capasFisicas].sort((a, b) => b.cantidad - a.cantidad);
  });
  
  private tileLayers: { [key: string]: any } = {
    'Oscuro': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', { maxNativeZoom: 16, maxZoom: 22 }),
    'Satélite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxNativeZoom: 19, maxZoom: 22 }),
    'Calles': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxNativeZoom: 19, maxZoom: 22 })
  };
  mapaBaseActual = 'Oscuro';

  capasFisicas = [
    { nombre: 'Calzadas', visible: true, instance: null as any, color: '#FF3B30', cantidad: 0, tipo: 'line' },
    { nombre: 'Puentes', visible: true, instance: null as any, color: '#FF2D55', cantidad: 0, tipo: 'line' },
    { nombre: 'Túneles', visible: true, instance: null as any, color: '#AF52DE', cantidad: 0, tipo: 'line' },
    { nombre: 'Estaciones de Peaje', visible: true, instance: null as any, color: '#FFCC00', cantidad: 0, tipo: 'point' },
    { nombre: 'Estaciones de Pesaje', visible: true, instance: null as any, color: '#FF9500', cantidad: 0, tipo: 'point' },
    { nombre: 'Ciclorruta', visible: false, instance: null as any, color: '#34C759', cantidad: 0, tipo: 'line' },
    { nombre: 'Muros', visible: false, instance: null as any, color: '#5856D6', cantidad: 0, tipo: 'line' },
    { nombre: 'CCO', visible: true, instance: null as any, color: '#FF00FF', cantidad: 0, tipo: 'point' },
    { nombre: 'Bermas', visible: true, instance: null as any, color: '#FFD60A', cantidad: 0, tipo: 'point' },
    { nombre: 'Cunetas', visible: true, instance: null as any, color: '#00FFFF', cantidad: 0, tipo: 'line' },
    { nombre: 'Defensa Vial', visible: false, instance: null as any, color: '#FF1493', cantidad: 0, tipo: 'line' },
    { nombre: 'Dispositivos ITS', visible: true, instance: null as any, color: '#8A2BE2', cantidad: 0, tipo: 'point' },
    { nombre: 'Luminarias', visible: true, instance: null as any, color: '#7FFF00', cantidad: 0, tipo: 'point' },
    { nombre: 'Señales Verticales', visible: true, instance: null as any, color: '#1E90FF', cantidad: 0, tipo: 'point' },
    { nombre: 'Separador', visible: false, instance: null as any, color: '#00FF7F', cantidad: 0, tipo: 'line' }
  ];

  constructor(private http: HttpClient, private title: Title) {
    const urlParams = new URLSearchParams(window.location.search);
    const proyectoId = urlParams.get('proyecto') || 'app-buga-buenaventura'; 
    this.baseUrl = `https://raw.githubusercontent.com/NicolasPlataANI/ani-datos-gis/main/${proyectoId}`;
  }

  ngOnInit() {
    this.http.get(`${this.baseUrl}/info_proyecto.json`).pipe(catchError(() => of(null))).subscribe({
      next: (data: any) => {
        if (data) {
          this.info.set(data);
          this.title.setTitle(`${data.nombre} - Dashboard ANI`);
        }
      }
    });
  }

  ngAfterViewInit() {
    this.initMap();
    this.cargarGeometrias();
  }

  private initMap() {
    this.map = L.map('map', { zoomControl: false, attributionControl: false }).setView([4.5709, -74.2973], 6);
    L.control.zoom({ position: 'bottomright' }).addTo(this.map);
    this.tileLayers[this.mapaBaseActual].addTo(this.map);
  }

  private async cargarGeometrias() {
    let bbox = L.latLngBounds([]);
    
    await Promise.all(this.capasFisicas.map(async (capa) => {
      try {
        const url = `${this.baseUrl}/${capa.nombre.toLowerCase().replace(/ /g, '_')}.fgb`;
        const response = await fetch(url);
        if (!response.ok) return;
        
        const iterador = fgb.geojson.deserialize(response.body!);
        const features = [];
        for await (const feature of iterador) {
          features.push(feature);
        }
        
        if (features.length > 0) {
          capa.cantidad = features.length;
          this.totalActivos += capa.cantidad;
          
          if (capa.tipo === 'point' && features.length > 50) {
            capa.instance = L.markerClusterGroup({
              iconCreateFunction: (cluster: any) => {
                const count = cluster.getChildCount();
                return L.divIcon({
                  html: `<div style="background-color: ${capa.color}; color: black; border-radius: 50%; border: 2px solid white; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-family: monospace; box-shadow: 0 4px 6px rgba(0,0,0,0.3); font-size: 11px;">${count}</div>`,
                  className: 'custom-cluster-icon',
                  iconSize: L.point(35, 35)
                });
              }
            });
            
            const geoJsonData = L.geoJSON(features as any, {
              pointToLayer: (f: any, latlng: any) => L.circleMarker(latlng, { radius: 5, fillColor: capa.color, color: '#fff', weight: 1, fillOpacity: 0.8 })
            });
            capa.instance.addLayer(geoJsonData);
          } else {
            capa.instance = L.geoJSON(features as any, {
              style: { color: capa.color, weight: capa.tipo === 'line' ? 4 : 1, opacity: 0.9 },
              pointToLayer: (f: any, latlng: any) => L.circleMarker(latlng, { radius: 5, fillColor: capa.color, color: '#fff', weight: 1, fillOpacity: 0.8 })
            });
          }
          
          if (capa.visible) {
            this.map.addLayer(capa.instance);
            bbox.extend(capa.instance.getBounds());
          }
        }
      } catch (e) {
        console.error(`Error cargando binario ${capa.nombre}:`, e);
      }
    }));

    if (bbox.isValid()) {
      this.initialBounds = bbox;
      this.map.fitBounds(bbox, { padding: [20, 20], maxZoom: 14 });
    }
    
    this.cargando.set(false);
  }

  toggleTema() {
    this.isDark.set(!this.isDark());
    const nuevoBase = this.isDark() ? 'Oscuro' : 'Calles';
    this.cambiarBase(nuevoBase);
  }

  cambiarBase(mapa: string) {
    this.map.removeLayer(this.tileLayers[this.mapaBaseActual]);
    this.mapaBaseActual = mapa;
    this.map.addLayer(this.tileLayers[this.mapaBaseActual]);
  }

  toggleCapa(capa: any) {
    capa.visible = !capa.visible;
    if (capa.instance && this.map) {
      if (capa.visible) this.map.addLayer(capa.instance);
      else this.map.removeLayer(capa.instance);
    }
  }

  toggleTodas(estado: boolean) {
    this.capasFisicas.forEach(capa => {
      if (capa.cantidad > 0) {
        if (capa.visible !== estado) {
          this.toggleCapa(capa);
        }
      }
    });
  }

  recentrar() {
    if (this.initialBounds && this.map) {
      this.map.fitBounds(this.initialBounds, { padding: [20, 20], maxZoom: 14 });
    }
  }
}
