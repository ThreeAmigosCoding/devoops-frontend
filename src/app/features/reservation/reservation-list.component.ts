import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>My Reservations</h1>
      <p>Reservation list will be implemented here.</p>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
    }
  `]
})
export class ReservationListComponent {}
