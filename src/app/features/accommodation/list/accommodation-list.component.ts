import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AccommodationCardComponent } from '@shared/components/accommodation-card/accommodation-card.component';
import { AccommodationService } from '@core/services/accommodation.service';
import { AuthService } from '@core/auth/services/auth.service';
import { AccommodationResponse, AccommodationSearchResponse, AccommodationSearchParams } from '@core/models/accommodation.model';
import { UserRole } from '@core/models/user.model';
import { AccommodationCreateComponent } from '../create/accommodation-create.component';
import { AccommodationSearchFormComponent } from './accommodation-search-form.component';

@Component({
  selector: 'app-accommodation-list',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    AccommodationCardComponent,
    AccommodationSearchFormComponent
  ],
  templateUrl: './accommodation-list.component.html',
  styleUrl: './accommodation-list.component.scss'
})
export class AccommodationListComponent implements OnInit {
  private readonly accommodationService = inject(AccommodationService);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);

  accommodations = signal<AccommodationResponse[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  currentPage = signal(0);
  totalPages = signal(0);
  hasMore = signal(false);
  loadingMore = signal(false);

  isSearchMode = signal(false);
  searchResults = signal<AccommodationSearchResponse[]>([]);

  get isHost(): boolean {
    return this.authService.hasRole(UserRole.HOST);
  }

  ngOnInit(): void {
    this.loadAccommodations();
  }

  private loadAccommodations(): void {
    this.loading.set(true);
    this.error.set(null);

    this.accommodationService.getAll(0, 12).subscribe({
      next: (response) => {
        this.accommodations.set(response.content);
        this.currentPage.set(response.number);
        this.totalPages.set(response.totalPages);
        this.hasMore.set(!response.last);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load accommodations. Please try again.');
        this.loading.set(false);
        console.error('Error loading accommodations:', err);
      }
    });
  }

  loadMore(): void {
    if (this.loadingMore() || !this.hasMore()) return;

    this.loadingMore.set(true);
    const nextPage = this.currentPage() + 1;

    this.accommodationService.getAll(nextPage, 12).subscribe({
      next: (response) => {
        this.accommodations.update(current => [...current, ...response.content]);
        this.currentPage.set(response.number);
        this.hasMore.set(!response.last);
        this.loadingMore.set(false);
      },
      error: (err) => {
        this.loadingMore.set(false);
        console.error('Error loading more accommodations:', err);
      }
    });
  }

  onSearch(params: AccommodationSearchParams): void {
    this.loading.set(true);
    this.error.set(null);
    this.isSearchMode.set(true);

    this.accommodationService.search(params).subscribe({
      next: (results) => {
        this.searchResults.set(results);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Search failed. Please check your parameters and try again.');
        this.loading.set(false);
        console.error('Error searching accommodations:', err);
      }
    });
  }

  onClearSearch(): void {
    this.isSearchMode.set(false);
    this.searchResults.set([]);
    this.error.set(null);
  }

  retry(): void {
    this.loadAccommodations();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(AccommodationCreateComponent, {
      width: '700px',
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe((result: AccommodationResponse | undefined) => {
      if (result) {
        this.accommodations.update(current => [result, ...current]);
      }
    });
  }
}
