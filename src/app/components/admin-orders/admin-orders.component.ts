import { Component, inject, signal } from '@angular/core';
import { Commande, DetailsCommande } from '../../types/Models';
import { AdminService } from '../../services/data_access/admin.service';
import { catchError, of } from 'rxjs';
import { TableComponent } from '../table/table.component';
import { AdminDetailViewComponent } from '../admin-detail-view/admin-detail-view.component';
import { CommandStatus, UserRole } from '../../types/AttributeTypes';
import { Message, MessageType } from '../../types/Others';
import { ToastService } from '../../services/helper/toast.service';
import { FormsModule } from '@angular/forms';
type modifiedCommande = Omit<Commande, 'utilisateur'> & { utilisateur: number };
const emptyOrder: Commande = {
  id: -1,
  utilisateur: { id: -1, nomUtilisateur: '', email: '', role: UserRole.CLIENT },
  dateCommande: new Date(),
  prixTotal: 0,
  status: CommandStatus.PENDING,
};

@Component({
  selector: 'app-admin-orders',
  imports: [FormsModule, TableComponent, AdminDetailViewComponent],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css',
})
export class AdminOrdersComponent {
  adminService = inject(AdminService);
  toastService = inject(ToastService);
  commandes = signal<modifiedCommande[]>([]);
  commandesObjects = signal<Commande[]>([]);
  commande = signal<Commande>(emptyOrder);
  detailsCommande = signal<DetailsCommande[]>([]);
  toggleDetailView = signal(false);
  toggleEditForm = signal(false);
  status = signal<CommandStatus>(CommandStatus.PENDING);

  constructor() {
    this.adminService
      .getCommandes()
      .pipe(
        catchError((err) => {
          if (typeof err.error === 'string') {
            return of(err.error);
          }
          return of("Failed: Une erreur est survenue lors de l'operation");
        }),
      )
      .subscribe((res) => {
        if (typeof res !== 'string') {
          this.commandes.set(
            res.map((val: Commande) => ({
              ...val,
              utilisateur: val.utilisateur.id,
            })),
          );
          this.commandesObjects.set(res);
        }
      });
  }

  onUpdateStatusClick(obj: modifiedCommande) {
    this.commande.set(
      this.commandesObjects().find((order) => order.id === obj.id)!,
    );
    this.toggleEditForm.set(true);
  }

  onStatusUpdate() {
    const message: Message = { text: '', type: MessageType.FAILURE };
    this.adminService
      .updateCommandeStatus(this.commande().id, this.status())
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
        this.toastService.setMessage(message);
      });
  }

  onViewClick(obj: modifiedCommande) {
    const order = this.commandesObjects().find((order) => order.id === obj.id);
    this.commande.set(order!);
    this.adminService
      .getDetailsCommande(this.commande().id)
      .subscribe((res) => {
        this.detailsCommande.set(res);
        this.toggleDetailView.set(true);
      });
  }

  onCancel() {
    this.commande.set(emptyOrder);
    this.toggleDetailView.set(false);
    this.toggleEditForm.set(false);
  }
}
