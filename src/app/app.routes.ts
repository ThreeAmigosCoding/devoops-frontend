import { Routes } from '@angular/router';
import { authGuard } from '@core/auth/guards/auth.guard';
import { guestGuard } from '@core/auth/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/search',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
    canActivate: [guestGuard]
  },
  {
    path: 'search',
    loadChildren: () => import('./features/search/search.routes').then(m => m.SEARCH_ROUTES)
  },
  {
    path: 'accommodations',
    loadChildren: () => import('./features/accommodation/accommodation.routes').then(m => m.ACCOMMODATION_ROUTES)
  },
  {
    path: 'reservations',
    loadChildren: () => import('./features/reservation/reservation.routes').then(m => m.RESERVATION_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'ratings',
    loadChildren: () => import('./features/rating/rating.routes').then(m => m.RATING_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'notifications',
    loadChildren: () => import('./features/notification/notification.routes').then(m => m.NOTIFICATION_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/user/user.routes').then(m => m.USER_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/search'
  }
];
