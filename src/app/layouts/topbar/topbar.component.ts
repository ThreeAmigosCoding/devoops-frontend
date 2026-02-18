import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '@core/auth/services/auth.service';
import { ThemeService } from '@core/services/theme.service';
import { UserRole } from '@core/models/user.model';
import { UserPayload } from '@core/auth/services/token.service';
import { ProfileDialogComponent } from '@features/user/profile-dialog.component';

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
  private readonly dialog = inject(MatDialog);

  protected readonly navItems: NavItem[] = [
    { label: 'Accommodations', path: '/accommodations' },
    { label: 'Reservations', path: '/reservations', roles: [UserRole.GUEST, UserRole.HOST] },
    { label: 'Ratings', path: '/ratings', roles: [UserRole.GUEST] }
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

  openProfile(): void {
    this.dialog.open(ProfileDialogComponent, { width: '80vw', maxWidth: '1000px' });
  }

  onLogout(): void {
    this.authService.logout();
  }
}
