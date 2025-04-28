import { Component, inject, signal } from '@angular/core';
import { LivreService } from '../../services/data_access/livre.service';
import { Livre } from '../../types/Models';
import { Router } from '@angular/router';
import { CardComponent } from '../../components/card/card.component';
import { SearchService } from '../../services/helper/search.service';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-books',
  imports: [CardComponent, NgClass, FormsModule],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css',
})
export class BooksComponent {
  search = signal('');
  searchWord = signal('');
  livreService = inject(LivreService);
  searchService = inject(SearchService);
  router = inject(Router);
  livres = signal<Livre[]>([]);
  limit = signal(12);

  constructor() {
    this.searchService.getSearchWord().subscribe((searchWord) => {
      this.livreService
        .getSearchedLivre(searchWord.trim().length > 0 ? searchWord : '')
        .subscribe((books) => this.livres.set(books));
    });
  }

  showLess() {
    if (this.limit() > 12) this.limit.update((val) => val - 4);
  }

  showMore() {
    if (this.limit() < this.livres().length)
      this.limit.update((val) => val + 8);
  }

  goToTop() {
    scroll(0, 0);
  }

  onSearchClick() {
    this.searchService.setSearchWord(this.search());
  }
}
