import { inject, Injectable } from '@angular/core';
import { RequestHelperService } from '../helper/request-helper.service';
import { Commande, DetailsCommande, Paiement } from '../../types/Models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommandeService {
  private helper = inject(RequestHelperService);

  constructor() {}

  getCommandes(): Observable<Commande[]> {
    return this.helper.get('/api/commandes');
  }

  getDetailsCommande(commandeId: number): Observable<DetailsCommande[]> {
    return this.helper.get('/api/commandes/' + commandeId);
  }

  createCommande(commande: DetailsCommande): Observable<string> {
    return this.helper.post('/api/commandes/creer', commande);
  }

  annulerCommande(commandeId: number): Observable<string> {
    return this.helper.post(`/api/commandes/annuler/${commandeId}`);
  }

  createPaiement(paiement: Paiement): Observable<string> {
    return this.helper.post(`/api/commandes/paiement`, paiement);
  }
}
