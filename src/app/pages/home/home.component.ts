import { Component, inject, signal } from '@angular/core';
import { LivreService } from '../../services/data_access/livre.service';
import { Livre } from '../../types/Models';
import { Router, RouterLink } from '@angular/router';
import { HeroComponent } from '../../components/hero/hero.component';
import { CardComponent } from '../../components/card/card.component';
import { SearchService } from '../../services/helper/search.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, HeroComponent, CardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  livreService = inject(LivreService);
  searchService = inject(SearchService);
  router = inject(Router);

  books = signal<Livre[]>([]);
  constructor() {
    this.livreService
      .getSimilarLivre('qualit')
      .subscribe((res) => this.books.set(res));
  }

  search(keyword: string) {
    this.searchService.setSearchWord(keyword);
    this.router.navigate(['/books']);
  }
}
