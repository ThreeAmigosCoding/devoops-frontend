import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>My Ratings</h1>
      <p>Rating list will be implemented here.</p>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
    }
  `]
})
export class RatingListComponent {}
