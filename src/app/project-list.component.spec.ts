import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectListComponent } from './project-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let fixture: ComponentFixture<ProjectListComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectListComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crear el componente e invocar la API', () => {
    expect(component).toBeTruthy();
    
    const req = httpMock.expectOne('https://raw.githubusercontent.com/NicolasPlataANI/ani-datos-gis/main/proyectos.json');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('debe agrupar los proyectos por mes y por modo', () => {
    const mockData = [
      { nombre: 'P1', mes: 'Enero 2024', modo: 'Férreo' },
      { nombre: 'P2', mes: 'Enero 2024', modo: 'Carretero' },
      { nombre: 'P3', mes: 'Enero 2024' }, // fallback a Carretero
      { nombre: 'P4' } // Proyecto sin mes (debe ir a 'Sin Fecha' y Carretero por defecto)
    ];

    const req = httpMock.expectOne('https://raw.githubusercontent.com/NicolasPlataANI/ani-datos-gis/main/proyectos.json');
    req.flush(mockData);

    const agrupados = component.proyectosAgrupados();
    expect(agrupados.length).toBe(2);
    
    // Enero 2024
    expect(agrupados[0].mes).toBe('Enero 2024');
    expect(agrupados[0].modos.length).toBe(2); // Férreo y Carretero
    
    const ferreosEnero = agrupados[0].modos.find((m: any) => m.nombre === 'Férreo');
    expect(ferreosEnero.proyectos.length).toBe(1);
    expect(ferreosEnero.proyectos[0].nombre).toBe('P1');
    
    const carreterosEnero = agrupados[0].modos.find((m: any) => m.nombre === 'Carretero');
    expect(carreterosEnero.proyectos.length).toBe(2); // P2 y P3
    
    // Sin Fecha
    expect(agrupados[1].mes).toBe('Sin Fecha');
    expect(agrupados[1].modos.length).toBe(1);
    expect(agrupados[1].modos[0].nombre).toBe('Carretero');
    expect(agrupados[1].modos[0].proyectos.length).toBe(1);
  });

  it('debe alternar entre tema claro y oscuro', () => {
    const req = httpMock.expectOne('https://raw.githubusercontent.com/NicolasPlataANI/ani-datos-gis/main/proyectos.json');
    req.flush([]);

    // Por defecto es oscuro según la última actualización
    expect(component.isDark()).toBe(true); 
    
    component.toggleTema();
    expect(component.isDark()).toBe(false);

    component.toggleTema();
    expect(component.isDark()).toBe(true);
  });

  it('debe filtrar los proyectos por nombre al realizar una búsqueda', () => {
    const mockData = [
      { nombre: 'Autopista Norte', mes: 'Enero 2024', modo: 'Carretero' },
      { nombre: 'Autopista Sur', mes: 'Febrero 2024', modo: 'Carretero' },
      { nombre: 'Tren Buga', mes: 'Enero 2024', modo: 'Férreo' }
    ];

    const req = httpMock.expectOne('https://raw.githubusercontent.com/NicolasPlataANI/ani-datos-gis/main/proyectos.json');
    req.flush(mockData);

    // Estado inicial: todos los proyectos
    let agrupados = component.proyectosAgrupados();
    expect(agrupados.length).toBe(2); // Dos meses

    // Aplicamos filtro
    component.actualizarBusqueda({ target: { value: 'Autopista' } } as any);
    
    agrupados = component.proyectosAgrupados();
    expect(agrupados.length).toBe(2);
    expect(agrupados[0].modos[0].proyectos.length).toBe(1); // Norte
    expect(agrupados[1].modos[0].proyectos.length).toBe(1); // Sur

    // Filtro más estricto
    component.actualizarBusqueda({ target: { value: 'Buga' } } as any);
    agrupados = component.proyectosAgrupados();
    expect(agrupados.length).toBe(1);
    expect(agrupados[0].mes).toBe('Enero 2024');
    expect(agrupados[0].modos[0].nombre).toBe('Férreo');
    expect(agrupados[0].modos[0].proyectos[0].nombre).toBe('Tren Buga');
  });

  it('debe manejar errores en la petición de proyectos mostrando un feedback visual', () => {
    const req = httpMock.expectOne('https://raw.githubusercontent.com/NicolasPlataANI/ani-datos-gis/main/proyectos.json');
    req.flush('Error interno', { status: 500, statusText: 'Server Error' });

    expect(component.errorCarga()).toBe(true);
    expect(component.proyectosAgrupados().length).toBe(0);
  });
});
