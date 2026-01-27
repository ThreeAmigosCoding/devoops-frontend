import { Routes } from '@angular/router';

export const RESERVATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./reservation-list.component').then(m => m.ReservationListComponent)
  }
];
