import { inject, Injectable } from '@angular/core';
import { RequestHelperService } from '../helper/request-helper.service';
import { Observable } from 'rxjs';
import {
  Auteur,
  Commande,
  DetailsCommande,
  DetailsLivre,
  Inventaire,
  Livre,
  Paiement,
  Utilisateur,
} from '../../types/Models';
import { CommandStatus } from '../../types/AttributeTypes';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private helper = inject(RequestHelperService);
  private ENDPOINT = '/api/admin';

  constructor() {}

  getAuteurs(): Observable<Auteur[]> {
    return this.helper.get(this.ENDPOINT + '/auteurs');
  }

  getAuteurById(auteurId: number): Observable<Auteur> {
    return this.helper.get(this.ENDPOINT + `/auteurs/${auteurId}`);
  }

  getAuteurByName(nom: string): Observable<Auteur[]> {
    return this.helper.get(this.ENDPOINT + `/auteurs/nom/${nom}`);
  }

  addAuteur(auteur: Auteur): Observable<string> {
    return this.helper.post(this.ENDPOINT + '/auteurs', auteur);
  }

  updateAuteur(auteur: Auteur): Observable<string> {
    return this.helper.put(this.ENDPOINT + '/auteurs', auteur);
  }

  deleteAuteur(auteurId: number): Observable<string> {
    return this.helper.delete(this.ENDPOINT + `/auteurs/${auteurId}`);
  }

  createLivre(livre: Livre): Observable<string> {
    return this.helper.post(this.ENDPOINT + '/livres', livre);
  }

  updateLivre(livre: Livre): Observable<string> {
    return this.helper.put(this.ENDPOINT + '/livres', livre);
  }

  deleteLivre(livreId: number): Observable<string> {
    return this.helper.delete(this.ENDPOINT + `/livres/${livreId}`);
  }

  createDetailsLivre(detail: DetailsLivre): Observable<string> {
    return this.helper.post(this.ENDPOINT + '/detailsLivre', detail);
  }

  updateDetailsLivre(detail: DetailsLivre): Observable<string> {
    return this.helper.put(this.ENDPOINT + '/detailsLivre', detail);
  }

  getAllDetailLivres(): Observable<DetailsLivre[]> {
    return this.helper.get(this.ENDPOINT + '/detailsLivre');
  }

  deleteDetailsLivre(detailLivreId: number): Observable<string> {
    return this.helper.delete(this.ENDPOINT + `/detailsLivre/${detailLivreId}`);
  }

  getUtilisateurs(): Observable<Utilisateur[]> {
    return this.helper.get(this.ENDPOINT + '/utilisateurs');
  }

  getUtilisateursRecent(): Observable<Utilisateur[]> {
    return this.helper.get(this.ENDPOINT + '/utilisateurs/recent');
  }

  searchUtilisateur(text: string): Observable<Utilisateur[]> {
    return this.helper.get(this.ENDPOINT + '/utilisateurs/search?text=' + text);
  }

  updateUtilisateur(
    user: Utilisateur | { motDePasse: string },
  ): Observable<string> {
    return this.helper.post(this.ENDPOINT + '/utilisateurs', user);
  }

  getUtilisateursCount(): Observable<number> {
    return this.helper.get(this.ENDPOINT + '/utilisateurs/count');
  }

  deleteUtilisateur(userId: number): Observable<string> {
    return this.helper.delete(this.ENDPOINT + `/utilisateurs/${userId}`);
  }

  getCommandes(): Observable<Commande[]> {
    return this.helper.get(this.ENDPOINT + '/commandes');
  }

  getCommandesRecent(): Observable<Utilisateur[]> {
    return this.helper.get(this.ENDPOINT + '/commandes/recent');
  }

  getCommandeById(commandId: number): Observable<Commande> {
    return this.helper.get(this.ENDPOINT + `/commandes/${commandId}`);
  }

  getCommandeByUserId(userId: number): Observable<Commande[]> {
    return this.helper.get(this.ENDPOINT + `/commandes/utilisateurs/${userId}`);
  }

  getDetailsCommande(commandId: number): Observable<DetailsCommande[]> {
    return this.helper.get(this.ENDPOINT + `/commandes/details/${commandId}`);
  }

  updateCommandeStatus(
    commandId: number,
    status: CommandStatus,
  ): Observable<string> {
    return this.helper.put(
      this.ENDPOINT + `/commandes/status/${commandId}/${status}`,
    );
  }

  getOrderCount(): Observable<number> {
    return this.helper.get(this.ENDPOINT + '/commandes/count');
  }

  getInventaire(): Observable<Inventaire[]> {
    return this.helper.get(this.ENDPOINT + '/inventaire');
  }

  getInventaireCount(): Observable<number> {
    return this.helper.get(this.ENDPOINT + '/inventaire/count');
  }

  getInventaireByDetailsLivreId(detailLivreId: number): Observable<Inventaire> {
    return this.helper.get(this.ENDPOINT + `/inventaire/${detailLivreId}`);
  }

  getInventaireFaibleStock(seuil: number): Observable<Inventaire[]> {
    return this.helper.get(
      this.ENDPOINT + `/inventaire/faible-stock?seuil=${seuil}`,
    );
  }

  addInventaire(inventaire: Inventaire): Observable<string> {
    return this.helper.post(this.ENDPOINT + '/inventaire', inventaire);
  }

  updateInventaire(inventaire: Inventaire): Observable<string> {
    return this.helper.put(this.ENDPOINT + '/inventaire', inventaire);
  }

  deleteInventaire(detailLivreId: number): Observable<string> {
    return this.helper.delete(this.ENDPOINT + `/inventaire/${detailLivreId}`);
  }

  getPaiements(): Observable<Paiement[]> {
    return this.helper.get(this.ENDPOINT + '/paiement');
  }
}
