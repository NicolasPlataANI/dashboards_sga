import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import { TranslationService } from './translation.service';
import { TranslatePipe } from './translate.pipe';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div [style.backgroundColor]="isDark() ? '#1a0f00' : '#FFE0B2'" 
         [style.color]="isDark() ? '#fde6d2' : '#1e293b'"
         class="min-h-screen w-full p-8 font-sans transition-colors duration-300">
      
      <div class="max-w-4xl mx-auto">
        
        <header [style.borderColor]="isDark() ? '#d35400' : '#EF6C00'" 
                class="flex justify-between items-center mb-12 border-b pb-8">
          <div class="flex items-center gap-6">
            <img src="logoani.png" alt="ANI" class="h-16 object-contain">
            <div>
              <h1 [style.color]="isDark() ? '#d35400' : '#EF6C00'" class="text-3xl font-black uppercase tracking-tight">
                {{ 'projects.title' | translate }}
              </h1>
              <p [style.color]="isDark() ? '#E65100' : '#F57C00'" class="text-[10px] font-mono uppercase tracking-widest mt-1">
                {{ 'projects.subtitle' | translate }}
              </p>
            </div>
          </div>

          <div class="flex gap-2">
            <button (click)="toggleLanguage()" 
                    [style.backgroundColor]="isDark() ? '#d35400' : '#EF6C00'"
                    class="px-4 py-2 rounded-xl font-bold border-none shadow-lg cursor-pointer transition-transform active:scale-90 text-white uppercase text-sm">
              {{ t.lang() }}
            </button>
            <button (click)="toggleTema()" 
                    [style.backgroundColor]="isDark() ? '#d35400' : '#EF6C00'"
                    class="px-4 py-2 rounded-xl text-xl border-none shadow-lg cursor-pointer transition-transform active:scale-90 text-white">
              {{ isDark() ? '🌞' : '🌚' }}
            </button>
          </div>
        </header>

        @if (errorCarga()) {
          <div class="bg-red-500/10 border border-red-500 text-red-600 p-6 rounded-xl mb-8 flex flex-col items-center justify-center text-center">
            <span class="text-3xl mb-2">⚠️</span>
            <h2 class="text-lg font-bold">{{ 'projects.error_title' | translate }}</h2>
            <p class="text-sm opacity-80 mt-1">{{ 'projects.error_desc' | translate }}</p>
          </div>
        } @else {
          <div class="mb-10">
            <input type="text" 
                   [placeholder]="'projects.search_placeholder' | translate" 
                   (input)="actualizarBusqueda($event)"
                   [style.backgroundColor]="isDark() ? '#2d1b0e' : '#FFF3E0'"
                   [style.borderColor]="isDark() ? '#d35400' : '#EF6C00'"
                   [style.color]="isDark() ? '#fff' : '#000'"
                   class="w-full p-4 rounded-xl border outline-none focus:ring-2 focus:ring-orange-500 shadow-sm transition-colors">
          </div>

          @if (proyectosAgrupados().length === 0 && proyectos().length > 0) {
            <p class="text-center italic opacity-60 mt-10">{{ 'projects.no_results' | translate }} "{{ terminoBusqueda() }}"</p>
          }
        }

        @for (grupo of proyectosAgrupados(); track grupo.mes) {
          <div class="mb-12">
            <h2 [style.color]="isDark() ? '#E65100' : '#EF6C00'" 
                class="text-sm font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-4">
              {{ grupo.mes }}
              <span [style.backgroundColor]="isDark() ? '#2d1b0e' : '#F57C00'" class="flex-1 h-px opacity-30"></span>
            </h2>

            <div class="grid gap-4">
              @for (p of grupo.proyectos; track p.nombre) {
                <div [style.backgroundColor]="isDark() ? '#2d1b0e' : '#FFF3E0'"
                     [style.borderColor]="isDark() ? '#d35400' : '#EF6C00'"
                     class="border p-6 rounded-2xl flex justify-between items-center hover:scale-[1.01] transition-all group shadow-sm">
                  <h3 [class]="isDark() ? 'text-white' : 'text-slate-800'" class="text-lg font-bold leading-tight uppercase">
                    {{ p.nombre }}
                  </h3>
                  <a [href]="'visor?proyecto=' + p.nombre" 
                     [style.backgroundColor]="isDark() ? '#d35400' : '#EF6C00'"
                     class="text-white px-6 py-2 rounded-lg font-black text-xs uppercase hover:brightness-110 active:scale-95 transition-all flex-shrink-0 shadow-md">
                    {{ 'projects.access' | translate }}
                  </a>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class ProjectListComponent implements OnInit {
  t = inject(TranslationService);
  proyectos = signal<any[]>([]);
  terminoBusqueda = signal('');
  errorCarga = signal(false);
  
  proyectosAgrupados = computed(() => {
    const filtrados = this.proyectos().filter(p => p.nombre.toLowerCase().includes(this.terminoBusqueda().toLowerCase()));
    return this.agruparPorMes(filtrados);
  });

  isDark = signal(true);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const url = 'https://raw.githubusercontent.com/NicolasPlataANI/ani-datos-gis/main/proyectos.json';
    this.http.get<any[]>(url).pipe(
      catchError(() => {
        this.errorCarga.set(true);
        return of([]);
      })
    ).subscribe(data => {
      this.proyectos.set(data);
    });
  }

  toggleTema() { this.isDark.set(!this.isDark()); }

  toggleLanguage() {
    const nextLang = this.t.lang() === 'es' ? 'en' : 'es';
    this.t.setLanguage(nextLang);
  }

  actualizarBusqueda(event: Event) {
    const input = event.target as HTMLInputElement;
    this.terminoBusqueda.set(input.value);
  }

  private agruparPorMes(data: any[]): any[] {
    const grupos = data.reduce((acc, p) => {
      const mes = p.mes || 'Sin Fecha';
      if (!acc[mes]) acc[mes] = [];
      acc[mes].push(p);
      return acc;
    }, {} as { [key: string]: any[] });
    return Object.keys(grupos).map(mes => ({ mes, proyectos: grupos[mes] }));
  }
}