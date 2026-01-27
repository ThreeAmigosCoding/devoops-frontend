import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accommodation-create',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Create Accommodation</h1>
      <p>Accommodation creation form will be implemented here.</p>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
    }
  `]
})
export class AccommodationCreateComponent {}
