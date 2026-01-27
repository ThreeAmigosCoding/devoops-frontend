import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accommodation-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Accommodation Details</h1>
      <p>Accommodation details will be implemented here.</p>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
    }
  `]
})
export class AccommodationDetailComponent {}
