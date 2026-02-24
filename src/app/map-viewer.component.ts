import { Component, OnInit, AfterViewInit, signal } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule, DecimalPipe, PercentPipe } from '@angular/common';
import { forkJoin, catchError, of } from 'rxjs';
import * as L from 'leaflet';
import Chart from 'chart.js/auto';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-map-viewer',
  standalone: true,
  imports: [HttpClientModule, CommonModule, DecimalPipe, PercentPipe],
  template: `
    <div class="h-screen w-full flex overflow-hidden bg-slate-950 text-slate-200 font-sans">
      
      <aside class="w-80 bg-slate-900 border-r border-slate-800 flex flex-col shadow-2xl z-20 flex-shrink-0">
        <header class="p-6 border-b border-slate-800">
          <p class="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Proyecto ANI</p>
          <h1 class="text-xl font-black text-white leading-tight uppercase">{{ info()?.nombre || 'Cargando...' }}</h1>
          <div class="mt-2 inline-block px-2 py-1 bg-emerald-900/50 text-emerald-400 text-[10px] uppercase font-bold rounded border border-emerald-800">
            {{ info()?.etapa || '---' }}
          </div>
        </header>

        <section class="flex-1 p-6 space-y-4 overflow-y-auto custom-scrollbar">
          <div class="space-y-3">
            <div class="bg-slate-800/40 p-3 rounded border border-slate-700/50">
              <p class="text-[9px] uppercase font-bold text-slate-400 mb-1">Avance Físico</p>
              <p class="text-2xl font-mono font-bold text-white">{{ info()?.avance_fisico | percent:'1.2-2' }}</p>
              <div class="w-full bg-slate-900 h-1 mt-2 rounded"><div class="bg-blue-500 h-full" [style.width]="((info()?.avance_fisico || 0) * 100) + '%'"></div></div>
            </div>
            <div class="bg-slate-800/40 p-3 rounded border border-slate-700/50">
              <p class="text-[9px] uppercase font-bold text-slate-400 mb-1">Avance Financiero</p>
              <p class="text-2xl font-mono font-bold text-white">{{ info()?.avance_financiero | percent:'1.2-2' }}</p>
              <div class="w-full bg-slate-900 h-1 mt-2 rounded"><div class="bg-emerald-500 h-full" [style.width]="((info()?.avance_financiero || 0) * 100) + '%'"></div></div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
            <div><p class="text-[9px] uppercase font-bold text-slate-500">Longitud</p><p class="text-sm font-bold text-slate-200">{{ info()?.longitud || 0 }} km</p></div>
            <div><p class="text-[9px] uppercase font-bold text-slate-500">Empleos</p><p class="text-sm font-bold text-slate-200">{{ info()?.empleos | number }}</p></div>
            <div class="col-span-2"><p class="text-[9px] uppercase font-bold text-slate-500">Beneficiados</p><p class="text-sm font-bold text-slate-200">{{ info()?.habitantes | number }}</p></div>
          </div>
        </section>
      </aside>

      <div class="flex-1 flex flex-col min-w-0">
        <div class="flex-1 flex min-h-0">
          <main class="flex-1 relative bg-slate-950 z-0">
            <div id="map" class="h-full w-full"></div>
          </main>

          <aside class="w-72 bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl z-10 flex-shrink-0">
            <div class="p-4 border-b border-slate-800 bg-slate-900">
              <p class="text-[9px] uppercase font-bold text-slate-500 mb-2">Mapa Base</p>
              <div class="flex gap-1">
                @for (base of ['Oscuro', 'Satélite', 'Calles']; track base) {
                  <button (click)="cambiarBase(base)" [class.bg-blue-600]="mapaBaseActual === base" [class.text-white]="mapaBaseActual === base" [class.bg-slate-800]="mapaBaseActual !== base" class="flex-1 py-1.5 text-[9px] font-bold uppercase rounded border border-slate-700 transition-colors">{{ base }}</button>
                }
              </div>
            </div>

            <div class="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
              <span class="text-[10px] uppercase font-bold text-slate-400">Inventario GIS ({{ totalActivos | number }})</span>
              <div class="flex gap-1">
                <button (click)="toggleTodas(true)" class="text-[8px] uppercase font-bold bg-slate-700 px-2 py-1 rounded hover:bg-slate-600">Todo</button>
                <button (click)="toggleTodas(false)" class="text-[8px] uppercase font-bold bg-slate-700 px-2 py-1 rounded hover:bg-slate-600">Nada</button>
              </div>
            </div>

            <div class="flex-1 p-2 overflow-y-auto custom-scrollbar">
              @for (capa of capasFisicas; track capa.nombre) {
                <label class="flex items-center justify-between group cursor-pointer p-2 hover:bg-slate-800 rounded">
                  <div class="flex items-center gap-3">
                    <div class="w-3 h-3 rounded-full border border-slate-600" [style.backgroundColor]="capa.color"></div>
                    <div class="flex flex-col">
                      <span class="text-xs font-bold text-slate-300 group-hover:text-white leading-none">{{ capa.nombre }}</span>
                      <span class="text-[10px] text-slate-500 font-mono mt-1">{{ capa.cantidad | number }} pts</span>
                    </div>
                  </div>
                  <input type="checkbox" [checked]="capa.visible" (change)="toggleCapa(capa)" [disabled]="capa.cantidad === 0" class="w-4 h-4 accent-blue-600 bg-slate-700 border-slate-600 rounded disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed">
                </label>
              }
            </div>
          </aside>
        </div>

        <section class="h-56 bg-slate-900 border-t border-slate-800 p-4 flex-shrink-0">
          <div class="h-full w-full">
            <canvas id="chartActivos"></canvas>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
  `]
})
export class MapViewerComponent implements OnInit, AfterViewInit {
  info = signal<any>(null);
  private map!: L.Map;
  private chartInstance!: Chart;
  totalActivos = 0;
  
  // URL Dinámica. Reemplaza "TU_REPO_DATOS" por el repositorio crudo que creaste.
  baseUrl = '';
  
  private tileLayers: { [key: string]: L.TileLayer } = {
    'Oscuro': L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'),
    'Satélite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
    'Calles': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
  };
  mapaBaseActual = 'Oscuro';

  // Solo declaramos el nombre del archivo. La URL completa se ensambla después.
  capasFisicas = [
    { nombre: 'Calzada', archivo: 'calzada.geojson', color: '#cbd5e1', visible: true, instance: null as L.GeoJSON | null, cantidad: 0 },
    { nombre: 'Puentes', archivo: 'puente.geojson', color: '#ef4444', visible: false, instance: null as L.GeoJSON | null, cantidad: 0 },
    { nombre: 'Túneles', archivo: 'tunel.geojson', color: '#64748b', visible: false, instance: null as L.GeoJSON | null, cantidad: 0 },
    { nombre: 'Peajes', archivo: 'estacion_peaje.geojson', color: '#eab308', visible: false, instance: null as L.GeoJSON | null, cantidad: 0 },
    { nombre: 'Pesaje', archivo: 'estacion_pesaje.geojson', color: '#f59e0b', visible: false, instance: null as L.GeoJSON | null, cantidad: 0 },
    { nombre: 'Ciclorruta', archivo: 'ciclorruta.geojson', color: '#10b981', visible: false, instance: null as L.GeoJSON | null, cantidad: 0 },
    { nombre: 'Muros', archivo: 'muro.geojson', color: '#78716c', visible: false, instance: null as L.GeoJSON | null, cantidad: 0 },
    { nombre: 'CCO', archivo: 'cco.geojson', color: '#8b5cf6', visible: false, instance: null as L.GeoJSON | null, cantidad: 0 },
    { nombre: 'Bermas', archivo: 'berma.geojson', color: '#334155', visible: false, instance: null as L.GeoJSON | null, cantidad: 0 },
    { nombre: 'Cunetas', archivo: 'cuneta.geojson', color: '#0ea5e9', visible: false, instance: null as L.GeoJSON | null, cantidad: 0 },
    { nombre: 'Defensa Vial', archivo: 'defensa_vial.geojson', color: '#f97316', visible: false, instance: null as L.GeoJSON | null, cantidad: 0 },
    { nombre: 'ITS', archivo: 'dispositivo_its.geojson', color: '#06b6d4', visible: false, instance: null as L.GeoJSON | null, cantidad: 0 },
    { nombre: 'Luminarias', archivo: 'luminarias.geojson', color: '#fcd34d', visible: false, instance: null as L.GeoJSON | null, cantidad: 0 },
    { nombre: 'Señalización', archivo: 'senal_vertical.geojson', color: '#ec4899', visible: false, instance: null as L.GeoJSON | null, cantidad: 0 },
    { nombre: 'Separador', archivo: 'separador.geojson', color: '#22c55e', visible: false, instance: null as L.GeoJSON | null, cantidad: 0 },
    { nombre: 'Zonas', archivo: 'zona_servicio.geojson', color: '#d946ef', visible: false, instance: null as L.GeoJSON | null, cantidad: 0 }
  ];

  constructor(private http: HttpClient, private titleService: Title) {}
  

  ngOnInit() {
    // Intercepción directa de la URL: ?proyecto=nombre-de-la-carpeta
    const urlParams = new URLSearchParams(window.location.search);

    console.log(urlParams)
    const proyectoId = urlParams.get('proyecto'); // Carpeta por defecto si no envían nada

    console.log(proyectoId)
    
    // Conexión a la base de datos estática de GitHub Raw
    this.baseUrl = `https://raw.githubusercontent.com/NicolasPlataANI/ani-datos-gis/main/${proyectoId}`;

    this.titleService.setTitle(`Inventario - ${proyectoId}`);

    this.http.get(`${this.baseUrl}/info_proyecto.json`).pipe(catchError(() => of(null))).subscribe({
      next: (data: any) => {
        if (!data) return;
        this.info.set({
          nombre: data.nombre["0"], etapa: data.etapa["0"], longitud: data.longitud["0"],
          avance_fisico: data.avance_fisico_ejecutado["0"], avance_financiero: data.avance_finaciero_ejecutado["0"],
          empleos: data.empleos_generados["0"], habitantes: data.habitantes_beneficiados["0"]
        });
      }
    });
  }

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap() {
    this.map = L.map('map', { zoomControl: false }).setView([4.6, -74.3], 7);
    L.control.zoom({ position: 'bottomright' }).addTo(this.map);
    this.tileLayers[this.mapaBaseActual].addTo(this.map);
    this.cargarGeometrias();
  }

  private cargarGeometrias() {
    // Ensamblaje dinámico de URLs y manejo de errores silencioso si falta un archivo
    const peticiones = this.capasFisicas.map(capa => 
      this.http.get(`${this.baseUrl}/${capa.archivo}`).pipe(catchError(() => of(null)))
    );

    forkJoin(peticiones).subscribe({
      next: (respuestas: any[]) => {
        let bbox = L.latLngBounds([]);
        this.totalActivos = 0;

        respuestas.forEach((geoData, idx) => {
          const capaRef = this.capasFisicas[idx];
          
          if (geoData && geoData.features) {
            capaRef.cantidad = geoData.features.length;
            this.totalActivos += capaRef.cantidad;

            capaRef.instance = L.geoJSON(geoData, {
              style: { color: capaRef.color, weight: 3, opacity: 0.9 },
              pointToLayer: (f, latlng) => L.circleMarker(latlng, { radius: 3, color: capaRef.color, fillColor: capaRef.color, fillOpacity: 0.8 })
            });

            if (capaRef.visible) {
              capaRef.instance.addTo(this.map);
              bbox.extend(capaRef.instance.getBounds());
            }
          }
        });

        if (bbox.isValid()) this.map.fitBounds(bbox, { padding: [50, 50] });
        this.renderizarGrafico();
      }
    });
  }

  private renderizarGrafico() {
    const datosValidos = this.capasFisicas.filter(c => c.cantidad > 0).sort((a, b) => b.cantidad - a.cantidad);
    
    if (this.chartInstance) this.chartInstance.destroy();
    if (datosValidos.length === 0) return; // Si no hay datos, no pintar lienzo vacío

    const ctx = document.getElementById('chartActivos') as HTMLCanvasElement;
    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: datosValidos.map(c => c.nombre),
        datasets: [{
          data: datosValidos.map(c => c.cantidad),
          backgroundColor: datosValidos.map(c => c.color),
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => `${ctx.raw} elementos` } } },
        scales: {
          y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
          x: { grid: { display: false }, ticks: { color: '#cbd5e1', font: { size: 10, weight: 'bold' }, autoSkip: false } }
        }
      }
    });
  }

  cambiarBase(nombre: string) {
    this.map.removeLayer(this.tileLayers[this.mapaBaseActual]);
    this.tileLayers[nombre].addTo(this.map);
    this.mapaBaseActual = nombre;
  }

  toggleCapa(capa: any) {
    if (capa.cantidad === 0) return; // Cortocircuito si no hay geometría
    capa.visible = !capa.visible;
    if (capa.visible && capa.instance) this.map.addLayer(capa.instance);
    else if (!capa.visible && capa.instance) this.map.removeLayer(capa.instance);
  }

  toggleTodas(estado: boolean) {
    this.capasFisicas.forEach(capa => {
      if (capa.cantidad > 0 && capa.visible !== estado) this.toggleCapa(capa);
    });
  }
}