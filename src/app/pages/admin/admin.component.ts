import { Component, inject, signal } from '@angular/core';
import { Commande, Utilisateur } from '../../types/Models';
import { AdminService } from '../../services/data_access/admin.service';
import { AdminBooksComponent } from '../../components/admin-books/admin-books.component';
import { AdminPreviewComponent } from '../../components/admin-preview/admin-preview.component';
import { AdminAuthorsComponent } from '../../components/admin-authors/admin-authors.component';
import { AdminUsersComponent } from '../../components/admin-users/admin-users.component';
import { AdminOrdersComponent } from '../../components/admin-orders/admin-orders.component';
import { NgClass } from '@angular/common';
import { catchError, of } from 'rxjs';
import { AdminInventoryComponent } from '../../components/admin-inventory/admin-inventory.component';
type modifiedCommande = Omit<Commande, 'utilisateur'> & { utilisateur: number };

@Component({
  selector: 'app-admin',
  imports: [
    AdminBooksComponent,
    AdminPreviewComponent,
    AdminAuthorsComponent,
    AdminUsersComponent,
    AdminOrdersComponent,
    AdminInventoryComponent,
    NgClass,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  adminService = inject(AdminService);
  commandes = signal<modifiedCommande[]>([]);
  users = signal<Utilisateur[]>([]);
  previewInterface = signal(false);
  booksInterface = signal(false);
  usersInterface = signal(false);
  ordersInterface = signal(false);
  authorsInterface = signal(false);
  inventoryInterface = signal(true);

  constructor() {
    this.adminService
      .getCommandesRecent()
      .pipe(
        catchError((err) => {
          if (typeof err.error === 'string') {
            return of(err.error);
          }
          return of("Failed: Une erreur est survenue lors de l'operation");
        }),
      )
      .subscribe((res) =>
        typeof res !== 'string'
          ? this.commandes.set(
              res.map((val: Commande) => ({
                ...val,
                utilisateur: val.utilisateur.id,
              })),
            )
          : true,
      );

    this.adminService
      .getUtilisateursRecent()
      .pipe(
        catchError((err) => {
          if (typeof err.error === 'string') {
            return of(err.error);
          }
          return of("Failed: Une erreur est survenue lors de l'operation");
        }),
      )
      .subscribe((res) =>
        typeof res !== 'string' ? this.users.set(res) : true,
      );
  }

  showBooks() {
    this.booksInterface.set(true);
    this.previewInterface.set(false);
    this.usersInterface.set(false);
    this.authorsInterface.set(false);
    this.ordersInterface.set(false);
    this.inventoryInterface.set(false);
  }

  showPreview() {
    this.previewInterface.set(true);
    this.booksInterface.set(false);
    this.usersInterface.set(false);
    this.authorsInterface.set(false);
    this.ordersInterface.set(false);
    this.inventoryInterface.set(false);
  }

  showOrders() {
    this.ordersInterface.set(true);
    this.previewInterface.set(false);
    this.booksInterface.set(false);
    this.usersInterface.set(false);
    this.authorsInterface.set(false);
    this.inventoryInterface.set(false);
  }

  showUsers() {
    this.usersInterface.set(true);
    this.previewInterface.set(false);
    this.booksInterface.set(false);
    this.authorsInterface.set(false);
    this.ordersInterface.set(false);
    this.inventoryInterface.set(false);
  }

  showAuthors() {
    this.authorsInterface.set(true);
    this.usersInterface.set(false);
    this.previewInterface.set(false);
    this.booksInterface.set(false);
    this.ordersInterface.set(false);
    this.inventoryInterface.set(false);
  }

  showInventory() {
    this.inventoryInterface.set(true);
    this.authorsInterface.set(false);
    this.usersInterface.set(false);
    this.previewInterface.set(false);
    this.booksInterface.set(false);
    this.ordersInterface.set(false);
  }
}
