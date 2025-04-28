import { Component, inject, input } from '@angular/core';
import { Livre } from '../../types/Models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  book = input.required<Livre>();
  router = inject(Router);

  onDetailClick() {
    //history.replaceState(this.book(), '', '/books/details');
    this.router.navigate(['/books/details'], {
      state: this.book(),
    });
  }
}
