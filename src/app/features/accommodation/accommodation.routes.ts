import { Routes } from '@angular/router';

export const ACCOMMODATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/accommodation-list.component').then(m => m.AccommodationListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./detail/accommodation-detail.component').then(m => m.AccommodationDetailComponent)
  }
];
