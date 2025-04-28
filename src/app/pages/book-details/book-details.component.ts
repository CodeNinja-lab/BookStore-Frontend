import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Inventaire, Livre, Utilisateur } from '../../types/Models';
import { FavorisService } from '../../services/data_access/favoris.service';
import { PanierService } from '../../services/data_access/panier.service';
import { catchError, of } from 'rxjs';
import { ToastService } from '../../services/helper/toast.service';
import { Message, MessageType } from '../../types/Others';
import { LivreService } from '../../services/data_access/livre.service';
import { BookFormat, UserRole } from '../../types/AttributeTypes';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CardComponent } from '../../components/card/card.component';
import { UserService } from '../../services/data_access/user.service';
import { AuthenticationService } from '../../services/data_access/authentication.service';
const emptyUser = {
  id: 0,
  nomUtilisateur: '',
  email: '',
  role: UserRole.CLIENT,
};
@Component({
  selector: 'app-book-details',
  imports: [CardComponent, FormsModule],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css',
})
export class BookDetailsComponent implements OnInit {
  livreService = inject(LivreService);
  favorisService = inject(FavorisService);
  panierService = inject(PanierService);

  authService = inject(AuthenticationService);
  userService = inject(UserService);
  currentUser = signal<Utilisateur>(emptyUser);

  toastService = inject(ToastService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  popup = signal(false);
  similarBooks = signal<Livre[]>([]);
  formats = Object.values(BookFormat);
  selectedFormat = signal('');
  selectedQuantity = signal(0);
  selectedInventaire = computed(() =>
    this.inventaire().filter(
      (value) => value.detailLivre.format === this.selectedFormat(),
    ),
  );

  maxQuantity = computed(() => {
    return this.selectedInventaire().length > 0
      ? this.selectedInventaire()[0].quantite
      : 0;
  });

  book = signal<Livre>({
    id: 0,
    titre: '',
    isbn: '',
    description: '',
    datePublication: new Date(),
    editeur: '',
    genre: '',
    image: '',
    nombrePages: 0,
    auteurs: [],
    details: [],
  });
  inventaire = signal<Inventaire[]>([]);

  constructor() {
    this.book.set(history.state);
    const searchTerm = this.book().titre.split(' ');
    this.livreService
      .getSimilarLivre(
        searchTerm.length > 1 ? searchTerm[1].substring(0, 3) : searchTerm[0],
      )
      .subscribe((res) => this.similarBooks.set(res.slice(1)));
    this.authService.isLoggedIn().subscribe(() => {
      this.userService
        .getUser()
        .subscribe((user) => this.currentUser.set(user));
    });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['reload']) {
        this.book.set(history.state);
      }
    });
  }
  onClickSimilar(livre: Livre) {
    //history.replaceState({ state: livre }, '', '/books/details');
    this.book.set(livre);
  }

  onFavorisClick() {
    if (this.currentUser().id === null) {
      this.router.navigate(['/login']);
      return;
    }
    this.favorisService
      .addFavoris(this.book().id)
      .pipe(
        catchError((res) => {
          return typeof res.error === 'string'
            ? of(res.error)
            : of(
                "Failed : Une erreur s'est produite lors de la communication avec le serveur. Essayez de vous reconnecter",
              );
        }),
      )
      .subscribe((res) => {
        const message: Message = {
          text: res,
          type: res.startsWith('Success')
            ? MessageType.SUCCESS
            : MessageType.FAILURE,
        };
        this.toastService.setMessage(message);
      });
  }

  onClickAjouter() {
    const message: Message = { text: '', type: MessageType.FAILURE };
    const inventaire = this.selectedInventaire();
    const quantity = this.selectedQuantity();
    if (inventaire.length > 0 && inventaire[0].quantite > 0) {
      if (quantity <= this.maxQuantity() && quantity > 0) {
        this.panierService
          .ajouterAuPanier(inventaire[0].detailLivre.id, quantity)
          .pipe(
            catchError((err) => {
              if (typeof err.error === 'string') return of(err.error);
              return of(
                "Failed : Une erreur s'est produite lors de la communication avec le serveur",
              );
            }),
          )
          .subscribe((res: string) => {
            message.text = res;
            if (res.startsWith('Success')) {
              message.type = MessageType.SUCCESS;
              this.onClickAnnuler();
            } else {
              this.router.navigate(['/login']);
            }
            this.toastService.setMessage(message);
          });
        return;
      } else {
        message.text =
          'Failed : La quantite spécifié est indisponible pour ce livre.';
      }
    } else {
      message.text =
        'Failed : Ce livre est indisponible au format spécifié pour le moment.';
    }
    this.toastService.setMessage(message);
  }

  onClickAnnuler() {
    this.selectedFormat.set('');
    this.selectedQuantity.set(0);
    this.popup.set(false);
  }

  onPanierClick() {
    this.livreService
      .getStockByDetailsLivreId(this.book().details[0].id)
      .pipe(
        catchError((err) => {
          return of(err.error);
        }),
      )
      .subscribe((inventaire) => {
        typeof inventaire !== 'string'
          ? this.inventaire.set([...this.inventaire(), inventaire])
          : this.toastService.setMessage({
              text: inventaire,
              type: MessageType.FAILURE,
            });
        this.popup.set(true);
      });
  }
}
