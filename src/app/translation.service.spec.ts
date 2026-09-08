import { TestBed } from '@angular/core/testing';
import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  let service: TranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslationService);
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe tener español como idioma por defecto', () => {
    expect(service.lang()).toBe('es');
  });

  it('debe traducir correctamente una clave', () => {
    expect(service.translate('projects.title')).toBe('Agencia Nacional de Infraestructura');
    
    service.setLanguage('en');
    
    expect(service.translate('projects.title')).toBe('National Infrastructure Agency');
  });
});
