import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '@core/auth/services/auth.service';
import { ThemeService } from '@core/services/theme.service';
import { User, UserRole } from '@core/models/user.model';
import {UserPayload} from '@core/auth/services/token.service';

interface NavItem {
  label: string;
  path: string;
  roles?: UserRole[];
  unauthOnly?: boolean;
  authOnly?: boolean;
}

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatToolbar, MatIconButton, MatIcon],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);

  protected readonly navItems: NavItem[] = [
    { label: 'Accommodations', path: '/accommodations' },
    { label: 'Create Accommodation', path: '/accommodations/create', roles: [UserRole.HOST] },
    { label: 'My Reservations', path: '/reservations', roles: [UserRole.GUEST] },
    { label: 'Ratings', path: '/ratings', roles: [UserRole.GUEST] },
    { label: 'Notifications', path: '/notifications', roles: [UserRole.GUEST, UserRole.HOST] },
    { label: 'Profile', path: '/profile', roles: [UserRole.GUEST, UserRole.HOST] }
  ];

  protected readonly user = toSignal(this.authService.currentUser$, { initialValue: null });
  protected readonly isDark = this.themeService.isDark;

  protected isVisible(item: NavItem): boolean {
    const currentUser: UserPayload | null = this.user();

    if (item.unauthOnly) {
      return currentUser === null;
    }

    if (item.authOnly) {
      return currentUser !== null;
    }

    if (item.roles) {
      return currentUser !== null && item.roles.includes(currentUser.role);
    }

    return true;
  }

  onToggleTheme(): void {
    this.themeService.toggle();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
