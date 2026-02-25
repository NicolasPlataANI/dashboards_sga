import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule],
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
                Agencia Nacional de Infraestructura
              </h1>
              <p [style.color]="isDark() ? '#E65100' : '#F57C00'" class="text-[10px] font-mono uppercase tracking-widest mt-1">
                Gestión de activos
              </p>
            </div>
          </div>

          <button (click)="toggleTema()" 
                  [style.backgroundColor]="isDark() ? '#d35400' : '#EF6C00'"
                  class="px-4 py-2 rounded-xl text-xl border-none shadow-lg cursor-pointer transition-transform active:scale-90 text-white">
            {{ isDark() ? '🌞' : '🌚' }}
          </button>
        </header>

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
                    Acceder
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
  proyectosAgrupados = signal<{ mes: string, proyectos: any[] }[]>([]);
  isDark = signal(true);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const url = 'https://raw.githubusercontent.com/NicolasPlataANI/ani-datos-gis/main/proyectos.json';
    this.http.get<any[]>(url).pipe(catchError(() => of([]))).subscribe(data => {
      this.proyectosAgrupados.set(this.agruparPorMes(data));
    });
  }

  toggleTema() { this.isDark.set(!this.isDark()); }

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