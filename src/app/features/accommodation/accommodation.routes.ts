import { Routes } from '@angular/router';
import { authGuard } from '@core/auth/guards/auth.guard';
import { roleGuard } from '@core/auth/guards/role.guard';
import { UserRole } from '@core/models/user.model';

export const ACCOMMODATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/accommodation-list.component').then(m => m.AccommodationListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./create/accommodation-create.component').then(m => m.AccommodationCreateComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.HOST] }
  },
  {
    path: ':id',
    loadComponent: () => import('./detail/accommodation-detail.component').then(m => m.AccommodationDetailComponent)
  }
];
