import { Routes } from '@angular/router';

export const RATING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./rating-list.component').then(m => m.RatingListComponent)
  }
];
