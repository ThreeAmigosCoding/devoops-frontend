import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accommodation-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>All Accommodations</h1>
      <p>Accommodation listing will be implemented here.</p>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
    }
  `]
})
export class AccommodationListComponent {}
