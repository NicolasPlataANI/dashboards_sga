import { Routes } from '@angular/router';
import { MapViewerComponent } from './map-viewer.component';
import { ProjectListComponent } from './project-list.component';

export const routes: Routes = [
  { path: 'visor', component: MapViewerComponent, data: { animation: 'VisorPage' } },
  { path: 'proyectos', component: ProjectListComponent, data: { animation: 'ProyectosPage' } },
  { path: '', redirectTo: 'proyectos', pathMatch: 'full' }
];