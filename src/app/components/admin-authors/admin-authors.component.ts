import { Component, inject, signal } from '@angular/core';
import { AdminService } from '../../services/data_access/admin.service';
import { Auteur } from '../../types/Models';
import { TableComponent } from '../table/table.component';
import { FormsModule } from '@angular/forms';
import { catchError, of, Subscription } from 'rxjs';
import { ToastService } from '../../services/helper/toast.service';
import { Message, MessageType } from '../../types/Others';
import { AdminDetailViewComponent } from '../admin-detail-view/admin-detail-view.component';
const emptyAuthor: Auteur = {
  id: -1,
  nom: '',
  biographie: '',
  dateNaissance: new Date(),
  pays: '',
};
@Component({
  selector: 'app-admin-authors',
  imports: [TableComponent, FormsModule, AdminDetailViewComponent],
  templateUrl: './admin-authors.component.html',
  styleUrl: './admin-authors.component.css',
})
export class AdminAuthorsComponent {
  adminService = inject(AdminService);
  authorsSub: Subscription;
  toastService = inject(ToastService);
  isUpdating = signal(false);
  authors = signal<Auteur[]>([]);
  author = signal<Auteur>(emptyAuthor);
  toggleAuthorView = signal(false);

  constructor() {
    this.authorsSub = this.adminService
      .getAuteurs()
      .pipe(
        catchError((err) => {
          if (typeof err.error === 'string') {
            return of(err.error);
          }
          return of(
            'Failed: Une erreur est survenue lors de la recuperation des auteurs',
          );
        }),
      )
      .subscribe((res) => this.authors.set(res));
  }

  onViewClick(author: Auteur) {
    this.author.set(author);
    this.toggleAuthorView.set(true);
  }

  onUpdateClick(author: any) {
    this.author.set(author);
    this.isUpdating.set(true);
  }

  onCancel() {
    this.isUpdating.set(false);
    this.toggleAuthorView.set(false);
    this.author.set(emptyAuthor);
  }

  onDeleteClick(author: Auteur) {
    const message: Message = { text: '', type: MessageType.FAILURE };
    if (confirm("Etes vous sure de vouloir supprimer l'auteur")) {
      this.adminService
        .deleteAuteur(author.id)
        .pipe(
          catchError((err) => {
            if (typeof err.error === 'string') {
              return of(err.error);
            }
            return of('Failed: Une erreur est survenue lors de la suppression');
          }),
        )
        .subscribe((res) => {
          message.text = res;
          if (res.startsWith('Success')) {
            message.type = MessageType.SUCCESS;
            this.authors.update((val) =>
              val.filter((auteur) => auteur.id !== author.id),
            );
          }
          this.resetSubscription();
          this.toastService.setMessage(message);
        });
    }
  }

  onSubmitAuthor() {
    const message: Message = { text: '', type: MessageType.FAILURE };
    if (this.isUpdating()) {
      this.adminService
        .updateAuteur(this.author())
        .pipe(
          catchError((err) => {
            if (typeof err.error === 'string') {
              return of(err.error);
            }
            return of('Failed: Une erreur est survenue lors de la mise a jour');
          }),
        )
        .subscribe((res) => {
          message.text = res;
          if (res.startsWith('Success')) {
            message.type = MessageType.SUCCESS;
            this.authors.update((val) =>
              val.map((auteur) =>
                auteur.id === this.author().id ? this.author() : auteur,
              ),
            );
          }
          this.resetSubscription();
          this.toastService.setMessage(message);
          this.onCancel();
        });
    } else {
      this.adminService
        .addAuteur(this.author())
        .pipe(
          catchError((err) => {
            if (typeof err.error === 'string') {
              return of(err.error);
            }
            return of('Failed: Une erreur est survenue lors de la creation');
          }),
        )
        .subscribe((res) => {
          message.text = res;
          if (res.startsWith('Success')) {
            message.type = MessageType.SUCCESS;
            this.authors.update((val) => [...val, this.author()]);
          }
          this.resetSubscription();
          this.toastService.setMessage(message);
          this.onCancel();
        });
    }
  }

  private resetSubscription() {
    this.authorsSub.unsubscribe();
    this.authors.set([]);
    this.authorsSub = this.adminService
      .getAuteurs()
      .pipe(
        catchError((err) => {
          if (typeof err.error === 'string') {
            return of(err.error);
          }
          return of(
            'Failed: Une erreur est survenue lors de la recuperation des auteurs',
          );
        }),
      )
      .subscribe((res) => this.authors.set(res));
  }
}
