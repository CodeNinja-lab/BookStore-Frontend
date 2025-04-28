import { inject, Injectable } from '@angular/core';
import { RequestHelperService } from '../helper/request-helper.service';
import { Observable } from 'rxjs';
import { Favoris } from '../../types/Models';

@Injectable({
  providedIn: 'root',
})
export class FavorisService {
  private helper = inject(RequestHelperService);

  constructor() {}

  getFavoris(): Observable<Favoris[]> {
    return this.helper.get('/api/favoris');
  }

  addFavoris(idLivre: number): Observable<string> {
    return this.helper.post(`/api/favoris/${idLivre}`);
  }

  deleteFavoris(idLivre: number): Observable<string> {
    return this.helper.delete(`/api/favoris/${idLivre}`);
  }
}
