import { Component, computed, inject, signal } from '@angular/core';
import { DetailsLivre, Inventaire } from '../../types/Models';
import { TableComponent } from '../table/table.component';
import { BookFormat } from '../../types/AttributeTypes';
import { AdminService } from '../../services/data_access/admin.service';
import { AdminDetailViewComponent } from '../admin-detail-view/admin-detail-view.component';
import { FormsModule } from '@angular/forms';
import { catchError, of, Subscription } from 'rxjs';
import { Message, MessageType } from '../../types/Others';
import { ToastService } from '../../services/helper/toast.service';
type DisplayInventory = {
  id: number;
  idLivre: number;
  format: BookFormat;
  prixUnitaire: number;
  langue: string;
  quantite: number;
};
const emptyInventory: Inventaire = {
  detailLivre: {
    id: -1,
    idLivre: 0,
    format: BookFormat.PHYSICAL,
    langue: '',
    prixUnitaire: 0,
  },
  quantite: 0,
};

@Component({
  selector: 'app-admin-inventory',
  imports: [TableComponent, AdminDetailViewComponent, FormsModule],
  templateUrl: './admin-inventory.component.html',
  styleUrl: './admin-inventory.component.css',
})
export class AdminInventoryComponent {
  adminService = inject(AdminService);
  toastService = inject(ToastService);
  inventaires = signal<Inventaire[]>([]);
  faibleStock = signal<Inventaire[]>([]);
  seuil = signal(0);
  selectedDetailId = signal<number>(-1);
  detailsRelation = computed(() => {
    const temp = new Map<number, DetailsLivre>();
    this.bookDetails().map((detail) => temp.set(detail.id, detail));
    return temp;
  });
  faibleStockSub: Subscription;
  inventaireSub: Subscription;
  bookDetails = signal<DetailsLivre[]>([]);
  inventory = signal<Inventaire>(emptyInventory);
  toggleInventoryView = signal(false);
  toggleUpdate = signal(false);
  displayInventory = computed(() => {
    const obj: DisplayInventory[] = [];
    this.inventaires().map((inventory) => {
      obj.push({
        id: inventory.detailLivre.id,
        idLivre: inventory.detailLivre.idLivre,
        format: inventory.detailLivre.format,
        prixUnitaire: inventory.detailLivre.prixUnitaire,
        langue: inventory.detailLivre.langue,
        quantite: inventory.quantite,
      });
    });
    return obj;
  });
  displayFaibleStock = computed(() => {
    const obj: DisplayInventory[] = [];
    this.faibleStock().map((inventory) => {
      obj.push({
        id: inventory.detailLivre.id,
        idLivre: inventory.detailLivre.idLivre,
        format: inventory.detailLivre.format,
        prixUnitaire: inventory.detailLivre.prixUnitaire,
        langue: inventory.detailLivre.langue,
        quantite: inventory.quantite,
      });
    });
    return obj;
  });

  constructor() {
    this.inventaireSub = this.adminService
      .getInventaire()
      .subscribe((res) => this.inventaires.set(res));
    this.adminService
      .getAllDetailLivres()
      .subscribe((res) => this.bookDetails.set(res));
    this.faibleStockSub = this.adminService
      .getInventaireFaibleStock(this.seuil())
      .subscribe((res) => this.faibleStock.set(res));
  }

  onViewClick(inventory: DisplayInventory) {
    this.inventory.set(this.getInventoryFromDisplayInventory(inventory));
    this.toggleInventoryView.set(true);
  }

  onUpdateClick(inventory: DisplayInventory) {
    this.inventory.set(this.getInventoryFromDisplayInventory(inventory));
    this.toggleUpdate.set(true);
  }

  onDeleteClick(inventory: DisplayInventory) {
    const message: Message = { text: '', type: MessageType.FAILURE };
    if (confirm('Voulez vous vraiment supprimer cet inventaire ? ')) {
      this.adminService
        .deleteInventaire(inventory.id)
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
          this.resetSubscriptions();
          this.onCancel();
          this.toastService.setMessage(message);
        });
    }
  }

  onSubmitInventory() {
    const detailId: number = Number(this.selectedDetailId());
    const message: Message = { text: '', type: MessageType.FAILURE };
    if (!this.toggleUpdate()) {
      if (this.selectedDetailId() > 0) {
        this.inventory.set({
          ...this.inventory(),
          detailLivre: this.detailsRelation().get(detailId)!,
        });
      }
      this.adminService
        .addInventaire(this.inventory())
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
          this.resetSubscriptions();
          this.onCancel();
          this.toastService.setMessage(message);
        });
    } else {
      this.adminService
        .updateInventaire(this.inventory())
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
          this.resetSubscriptions();
          this.onCancel();
          this.toastService.setMessage(message);
        });
    }
  }

  onCancel() {
    this.inventory.set(emptyInventory);
    this.toggleInventoryView.set(false);
    this.toggleUpdate.set(false);
  }

  onShowFaibleStock() {
    this.resetSubscriptions();
  }

  private getInventoryFromDisplayInventory(
    displayInventory: DisplayInventory,
  ): Inventaire {
    const details: DetailsLivre = {
      id: displayInventory.id,
      idLivre: displayInventory.idLivre,
      format: displayInventory.format,
      langue: displayInventory.langue,
      prixUnitaire: displayInventory.prixUnitaire,
    };
    return {
      detailLivre: details,
      quantite: displayInventory.quantite,
    };
  }

  private resetSubscriptions() {
    this.faibleStockSub.unsubscribe();
    this.faibleStock.set([]);
    this.faibleStockSub = this.adminService
      .getInventaireFaibleStock(this.seuil())
      .subscribe((res) => this.faibleStock.set(res));

    this.inventaireSub.unsubscribe();
    this.inventaires.set([]);
    this.inventaireSub = this.adminService
      .getInventaire()
      .subscribe((res) => this.inventaires.set(res));
  }
}
