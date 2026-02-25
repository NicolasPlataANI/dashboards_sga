import { Routes } from '@angular/router';
import { MapViewerComponent } from './map-viewer.component';
import { ProjectListComponent } from './project-list.component';

export const routes: Routes = [
  { path: 'visor', component: MapViewerComponent },
  { path: 'proyectos', component: ProjectListComponent },
  { path: '', redirectTo: 'visor', pathMatch: 'full' }
];