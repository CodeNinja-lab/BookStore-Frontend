import { Component, inject, input, signal } from '@angular/core';
import { TableComponent } from '../../components/table/table.component';
import { Commande } from '../../types/Models';
import { AdminService } from '../../services/data_access/admin.service';
type modifiedCommande = Omit<Commande, 'utilisateur'> & { utilisateur: number };

@Component({
  selector: 'app-admin-preview',
  imports: [TableComponent],
  templateUrl: './admin-preview.component.html',
  styleUrl: './admin-preview.component.css',
})
export class AdminPreviewComponent {
  adminService = inject(AdminService);
  commandes = input.required<any[]>();
  users = input.required<any[]>();
  userCount = signal(0);
  orderCount = signal(0);
  stockCount = signal(0);

  constructor() {
    this.adminService
      .getUtilisateursCount()
      .subscribe((res) => this.userCount.set(res));
    this.adminService
      .getOrderCount()
      .subscribe((res) => this.orderCount.set(res));
    this.adminService
      .getInventaireCount()
      .subscribe((res) => this.stockCount.set(res));
  }
}
