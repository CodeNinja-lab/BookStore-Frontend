import { inject, Injectable } from '@angular/core';
import { RequestHelperService } from '../helper/request-helper.service';
import { Observable } from 'rxjs';
import { Panier } from '../../types/Models';

@Injectable({
  providedIn: 'root',
})
export class PanierService {
  private helper = inject(RequestHelperService);

  constructor() {}

  getPanier(): Observable<Panier[]> {
    return this.helper.get('/api/panier');
  }

  ajouterAuPanier(detailLivreId: number, quantite: number): Observable<string> {
    return this.helper.post(`/api/panier/add/${detailLivreId}/${quantite}`);
  }

  viderPanier(): Observable<string> {
    return this.helper.delete('/api/panier/clear');
  }

  enleverElementDuPanier(detailLivreId: number): Observable<string> {
    return this.helper.delete(`/api/panier/${detailLivreId}`);
  }
}
