import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestHelperService } from '../helper/request-helper.service';
import { Inventaire, Livre } from '../../types/Models';

@Injectable({
  providedIn: 'root',
})
export class LivreService {
  private helper = inject(RequestHelperService);
  constructor() { }

  getLivres(): Observable<Livre[]> {
    return this.helper.get('/api/livres');
  }

  getLivreById(id: number): Observable<Livre> {
    return this.helper.get(`/api/livres/${id}`).pipe();
  }

  getLivreByIsbn(isbn: string): Observable<Livre> {
    return this.helper.get(`/api/livres/isbn/${isbn}`);
  }

  getLivreByGenre(genre: string): Observable<Livre[]> {
    return this.helper.get(`/api/livres/genre/${genre}`);
  }

  getLivreByTitre(titre: string): Observable<Livre[]> {
    return this.helper.get(`/api/livres/titre/${titre}`);
  }

  getLivreByAuteurNom(nom: string): Observable<Livre[]> {
    return this.helper.get(`/api/livres/auteur/${nom}`);
  }

  getSimilarLivre(text: string): Observable<Livre[]> {
    return this.helper.get(`/api/livres/similar/${text}`);
  }

  getSearchedLivre(text: string): Observable<Livre[]> {
    return this.helper.get(`/api/livres/search?text=${text}`);
  }

  getStockByDetailsLivreId(detailsLivreId: number): Observable<Inventaire> {
    return this.helper.get(`/api/livres/stock/${detailsLivreId}`);
  }
}
