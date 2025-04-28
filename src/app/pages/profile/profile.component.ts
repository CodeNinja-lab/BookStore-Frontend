import { Component, computed, inject, signal } from '@angular/core';
import { UserService } from '../../services/data_access/user.service';
import { CommandStatus, UserRole } from '../../types/AttributeTypes';
import {
  Commande,
  DetailsCommande,
  Favoris,
  Livre,
  Utilisateur,
} from '../../types/Models';
import { AuthenticationService } from '../../services/data_access/authentication.service';
import { NgClass } from '@angular/common';
import { TableComponent } from '../../components/table/table.component';
import { CommandeService } from '../../services/data_access/commande.service';
import { AdminDetailViewComponent } from '../../components/admin-detail-view/admin-detail-view.component';
import { FormsModule } from '@angular/forms';
import { catchError, of, Subscription } from 'rxjs';
import { Message, MessageType } from '../../types/Others';
import { ToastService } from '../../services/helper/toast.service';
import { MINIMUM_PASSWORD } from '../../utils/Constants';
import { FavorisService } from '../../services/data_access/favoris.service';
import { Router } from '@angular/router';
import { LivreService } from '../../services/data_access/livre.service';
const emptyUser = {
  id: 0,
  nomUtilisateur: '',
  email: '',
  role: UserRole.CLIENT,
};
const emptyOrder: ModifiedCommande = {
  id: 0,
  dateCommande: new Date(),
  prixTotal: 0,
  status: CommandStatus.PENDING,
};
type ModifiedCommande = Omit<Commande, 'utilisateur'>;

@Component({
  selector: 'app-profile',
  imports: [FormsModule, NgClass, AdminDetailViewComponent, TableComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  router = inject(Router);
  toastService = inject(ToastService);
  favorisService = inject(FavorisService);
  userService = inject(UserService);
  livreService = inject(LivreService);
  commandeService = inject(CommandeService);
  authService = inject(AuthenticationService);
  currentUser = signal<Utilisateur>(emptyUser);
  commandes = signal<Commande[]>([]);
  commande = signal<ModifiedCommande>(emptyOrder);
  detailsCommande = signal<DetailsCommande[]>([]);
  favorisSub: Subscription;
  favoris = signal<Favoris[]>([]);
  password = signal('');
  confirmPassword = signal('');
  isPasswordRevealed = signal(false);
  toggleFavoris = signal(true);
  toggleCommandes = signal(false);
  toggleChangeInfo = signal(false);
  toggleDetailView = signal(false);
  livres = computed(() => {
    return this.favoris().map((favori) => favori.livre);
  });
  displayCommandes = computed<ModifiedCommande[]>(() => {
    return this.commandes().map((order) => ({
      id: order.id,
      dateCommande: order.dateCommande,
      prixTotal: order.prixTotal,
      status: order.status,
    }));
  });
  constructor() {
    this.authService.isLoggedIn().subscribe(() => {
      this.userService
        .getUser()
        .subscribe((user) => this.currentUser.set(user));
    });

    this.commandeService
      .getCommandes()
      .subscribe((res) => this.commandes.set(res));

    this.favorisSub = this.favorisService
      .getFavoris()
      .subscribe((res) => this.favoris.set(res));
  }

  revealPassword() {
    this.isPasswordRevealed.set(!this.isPasswordRevealed());
  }

  onFavorisClick() {
    this.toggleFavoris.set(true);
    this.toggleChangeInfo.set(false);
    this.toggleCommandes.set(false);
  }
  onCommandesClick() {
    this.toggleCommandes.set(true);
    this.toggleChangeInfo.set(false);
    this.toggleFavoris.set(false);
  }
  onChangeInfoClick() {
    this.toggleChangeInfo.set(true);
    this.toggleFavoris.set(false);
    this.toggleCommandes.set(false);
  }

  onViewClick(commande: ModifiedCommande) {
    this.commande.set(commande);
    this.commandeService
      .getDetailsCommande(this.commande().id)
      .subscribe((res) => {
        this.detailsCommande.set(res);
        this.toggleDetailView.set(true);
      });
  }

  onCancel() {
    this.toggleDetailView.set(false);
  }

  annulerChange() {
    this.password.set('');
    this.confirmPassword.set('');
  }

  submitChange() {
    const message: Message = { text: '', type: MessageType.FAILURE };
    if (this.password().trim().length < MINIMUM_PASSWORD) {
      message.text =
        'Failed : Le mot de passe doit etre au minimum ' +
        MINIMUM_PASSWORD +
        ' caratères';
    }
    if (this.password() !== this.confirmPassword()) {
      message.text = 'Failed : Les mots de passe saisies sont differents';
    }
    if (message.text.trim().length === 0) {
      this.userService
        .changePassword(this.password())
        .pipe(
          catchError((err) => {
            if (typeof err.error === 'string') {
              return of(err.error);
            }
            return of("Failed: Une erreur est survenue lors de l'operation");
          }),
        )
        .subscribe((res) => {
          message.text = res;
          message.type = res.startsWith('Success')
            ? MessageType.SUCCESS
            : MessageType.FAILURE;
          this.toastService.setMessage(message);
        });
    } else {
      this.toastService.setMessage(message);
    }
  }

  onBookDetailsClick(livre: Livre) {
    this.livreService.getLivreById(livre.id).subscribe((res) => {
      this.router.navigate(['/books/details'], {
        state: res,
      });
    });
  }

  onRemoveFromFavorites(livre: Livre) {
    const message: Message = { text: '', type: MessageType.FAILURE };
    this.favorisService
      .deleteFavoris(livre.id)
      .pipe(
        catchError((err) => {
          if (typeof err.error === 'string') {
            return of(err.error);
          }
          return of("Failed: Une erreur est survenue lors de l'operation");
        }),
      )
      .subscribe((res) => {
        message.text = res;
        message.type = res.startsWith('Success')
          ? MessageType.SUCCESS
          : MessageType.FAILURE;
        this.resetSubscription();
        this.toastService.setMessage(message);
      });
  }

  disconnect() {
    this.authService.logout().subscribe((res) => {
      const message: Message = { text: res, type: MessageType.FAILURE };
      if (res.startsWith('Success')) {
        message.type = MessageType.SUCCESS;
        this.router.navigate(['/login']);
      }
      this.toastService.setMessage(message);
    });
  }

  private resetSubscription() {
    this.favorisSub.unsubscribe();
    this.favoris.set([]);
    this.favorisSub = this.favorisService
      .getFavoris()
      .subscribe((res) => this.favoris.set(res));
  }
}
