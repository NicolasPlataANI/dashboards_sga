import { Injectable, signal } from '@angular/core';

export type Language = 'es' | 'en';

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  es: {
    'projects.title': 'Agencia Nacional de Infraestructura',
    'projects.subtitle': 'Gestión de activos',
    'projects.search_placeholder': 'Buscar proyecto por nombre...',
    'projects.no_results': 'No se encontraron proyectos para',
    'projects.access': 'Acceder',
    'projects.error_title': 'Error de conexión',
    'projects.error_desc': 'No se pudo cargar la lista de proyectos. Verifica tu conexión a internet o intenta más tarde.',
    'map.loading': 'Decodificando binario...',
    'map.project': 'Proyecto ANI',
    'map.mode': 'Modo',
    'map.stage': 'Etapa',
    'map.length': 'Longitud',
    'map.month': 'Mes de Avance',
    'map.recentering': '📍 Recentrar Mapa',
    'map.basemap': 'Mapa Base',
    'map.basemap.dark': 'Oscuro',
    'map.basemap.satellite': 'Satélite',
    'map.basemap.streets': 'Calles',
    'map.inventory': 'Inventario GIS',
    'map.all': 'Todo',
    'map.none': 'Nada',
    'map.expand': 'Expandir',
    'map.reduce': 'Reducir'
  },
  en: {
    'projects.title': 'National Infrastructure Agency',
    'projects.subtitle': 'Asset Management',
    'projects.search_placeholder': 'Search project by name...',
    'projects.no_results': 'No projects found for',
    'projects.access': 'Access',
    'projects.error_title': 'Connection Error',
    'projects.error_desc': 'Could not load the project list. Check your internet connection or try again later.',
    'map.loading': 'Decoding binary...',
    'map.project': 'ANI Project',
    'map.mode': 'Mode',
    'map.stage': 'Stage',
    'map.length': 'Length',
    'map.month': 'Progress Month',
    'map.recentering': '📍 Recenter Map',
    'map.basemap': 'Base Map',
    'map.basemap.dark': 'Dark',
    'map.basemap.satellite': 'Satellite',
    'map.basemap.streets': 'Streets',
    'map.inventory': 'GIS Inventory',
    'map.all': 'All',
    'map.none': 'None',
    'map.expand': 'Expand',
    'map.reduce': 'Reduce'
  }
};

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  lang = signal<Language>('es');

  setLanguage(language: Language) {
    this.lang.set(language);
  }

  translate(key: string): string {
    return TRANSLATIONS[this.lang()][key] || key;
  }
}
