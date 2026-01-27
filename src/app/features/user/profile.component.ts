import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>My Profile</h1>
      <p>User profile will be implemented here.</p>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
    }
  `]
})
export class ProfileComponent {}
