import { Component, inject, signal } from '@angular/core';
import { PanierService } from '../../services/data_access/panier.service';
import { Livre, Panier } from '../../types/Models';
import { LivreService } from '../../services/data_access/livre.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  panierService = inject(PanierService);
  livreService = inject(LivreService);
  router = inject(Router);
  panier = signal<(Panier & { livre: Livre })[]>([]);

  constructor() {
    this.panierService.getPanier().subscribe((res) => {
      res.map((panier) =>
        this.livreService
          .getLivreById(panier.detailLivre.idLivre)
          .subscribe((livre) => {
            this.panier().push({
              detailLivre: panier.detailLivre,
              quantite: panier.quantite,
              dateAjout: panier.dateAjout,
              livre: livre,
            });
          }),
      );
    });
  }

  onClickDetails(livre: Livre) {
    this.router.navigate(['/books/details'], { state: livre });
  }
  onClickRetirer(detailLivreId: number) {
    this.panierService.enleverElementDuPanier(detailLivreId).subscribe();
  }
}
