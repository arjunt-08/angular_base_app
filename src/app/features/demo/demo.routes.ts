import { Routes } from '@angular/router';
import { provideDemoFeature } from './demo.providers';

export const DEMO_ROUTES: Routes = [
  {
    path: '',
    providers: [provideDemoFeature()],
    loadComponent: () =>
      import('./presentation/demo-list.component').then((m) => m.DemoListComponent),
  },
];
