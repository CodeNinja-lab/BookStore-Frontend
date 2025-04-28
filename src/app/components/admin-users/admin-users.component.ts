import { Component, inject, signal } from '@angular/core';
import { Utilisateur } from '../../types/Models';
import { TableComponent } from '../table/table.component';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/data_access/admin.service';
import { UserRole } from '../../types/AttributeTypes';
import { catchError, Observable, of, Subscription } from 'rxjs';
import { Message, MessageType } from '../../types/Others';
import { ToastService } from '../../services/helper/toast.service';
import { EMAIL_REGEX } from '../../utils/Constants';
import { AdminDetailViewComponent } from '../admin-detail-view/admin-detail-view.component';
const emptyUser = {
  id: -1,
  nomUtilisateur: '',
  email: '',
  role: UserRole.CLIENT,
};

@Component({
  selector: 'app-admin-users',
  imports: [TableComponent, FormsModule, AdminDetailViewComponent],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css',
})
export class AdminUsersComponent {
  adminService = inject(AdminService);
  toastService = inject(ToastService);
  users = signal<Utilisateur[]>([]);
  usersSub: Subscription;
  displayUsers = signal<Utilisateur[]>([]);
  user = signal<Utilisateur>(emptyUser);
  word = signal('');
  password = signal('');
  toggleUserView = signal(false);
  toggleEditForm = signal(false);

  constructor() {
    this.usersSub = this.adminService
      .getUtilisateurs()
      .subscribe((users) => this.users.set(users));
  }

  onSearch() {
    this.displayUsers.set([]);
    this.adminService
      .searchUtilisateur(this.word().trim().length > 0 ? this.word() : ' ')
      .subscribe((res) => {
        this.displayUsers.set(res);
      });
  }

  onViewClick(user: Utilisateur) {
    this.user.set(user);
    this.toggleUserView.set(true);
  }

  onUpdateClick(user: Utilisateur) {
    this.user.set(user);
    this.toggleEditForm.set(true);
  }

  onCancel() {
    this.user.set(emptyUser);
    this.toggleUserView.set(false);
    this.toggleEditForm.set(false);
  }

  onDeleteClick(user: Utilisateur) {
    const message: Message = { text: '', type: null };
    if (confirm("Voulez-vous vraiment supprimer l'utilisateur?")) {
      this.subscribe(this.adminService.deleteUtilisateur(user.id), message);
    }
  }

  onUpdateUserClick() {
    const message: Message = { text: '', type: null };
    if (!this.user().email.match(EMAIL_REGEX)) {
      message.text = "Failed : Le format de l'email est incorrecte";
    }
    if (message.text.trim().length === 0) {
      const obs = this.adminService.updateUtilisateur({
        ...this.user(),
        motDePasse: this.password(),
      });
      this.subscribe(obs, message);
    } else {
      message.type = MessageType.FAILURE;
      this.toastService.setMessage(message);
    }
  }

  private subscribe(obs: Observable<any>, message: Message) {
    obs
      .pipe(
        catchError((err) => {
          if (typeof err.error === 'string') {
            return of(err.error);
          }
          return of("Failed: Une erreur est survenue lors de l'operation");
        }),
      )
      .subscribe((res) => {
        message.text =
          "Failed : Une erreur s'est produite lors de la communication avec le serveur, veuillez réessayer";
        if (typeof res === 'string') {
          message.text = res;
          message.type = res.startsWith('Success')
            ? MessageType.SUCCESS
            : MessageType.FAILURE;
        }
        this.resetSubscription();
        this.toastService.setMessage(message);
      });
  }

  private resetSubscription() {
    this.usersSub.unsubscribe();
    this.users.set([]);
    this.usersSub = this.adminService
      .getUtilisateurs()
      .subscribe((users) => this.users.set(users));
  }
}
