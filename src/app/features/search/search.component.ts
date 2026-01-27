import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="search-container">
      <h1>Search Accommodations</h1>
      <p>Search functionality will be implemented here.</p>
    </div>
  `,
  styles: [`
    .search-container {
      padding: 2rem;
    }
  `]
})
export class SearchComponent {}
