import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auteur, DetailsLivre, Livre } from '../../types/Models';
import { AdminService } from '../../services/data_access/admin.service';
import { TableComponent } from '../table/table.component';
import { LivreService } from '../../services/data_access/livre.service';
import { AdminDetailViewComponent } from '../admin-detail-view/admin-detail-view.component';
import { BookFormat } from '../../types/AttributeTypes';
import { Message, MessageType } from '../../types/Others';
import { catchError, Observable, of, Subscription } from 'rxjs';
import { ToastService } from '../../services/helper/toast.service';

type bookDetails = {
  auteurs: Auteur[];
  details: DetailsLivre[];
  description: string;
  genre: string;
  image: string;
};

type DisplayBookType = {
  id: number;
  titre: string;
  isbn: string;
  datePublication: Date;
  editeur: string;
  nombrePages: number;
};

const emptyBook: Livre = {
  id: -1,
  titre: '',
  isbn: '',
  datePublication: new Date(),
  editeur: '',
  nombrePages: 0,
  description: '',
  details: [],
  auteurs: [],
  genre: '',
  image: '',
};

const emptyBookDetail: DetailsLivre = {
  id: -1,
  idLivre: 0,
  format: BookFormat.PHYSICAL,
  prixUnitaire: 0,
  langue: '',
};

@Component({
  selector: 'app-admin-books',
  imports: [FormsModule, TableComponent, AdminDetailViewComponent],
  templateUrl: './admin-books.component.html',
  styleUrl: './admin-books.component.css',
})
export class AdminBooksComponent {
  //Details is bugged when you click on another book. Correct routing after logging and when i cliek on antoehr detail and refresh it should give me the last book i clicked THIS AND GO TO USER PROFILE AND CART AFTER THAT YOU WILL ONLY NEED TO UPDATE THE LINKS/ROUTERLINKS AND REMOVE HREFS/ ALSO THE HOME PAGE GOT SOME WORK LEFT TO DO. ABOUT AND CONTACT PAGE. IF IM A USER I SHOULD SEE ADMIN CENTER WHEN I CLICK ON PROFILE AND IF IM ADMIN I SHOULDNT SEE CART FAVORITE OR PROFILE. ADD A SEARCH ICON THAT TOGGLES SEARCH FOR MOBILE ON THE NAVBAR.UPDATE THE FOOTER. MAYBE REFACTORING IF WE HAVE TIME
  //FINISH INVENTORY AND GO TO PROFILE AND CART
  adminService = inject(AdminService);
  toastService = inject(ToastService);
  livreService = inject(LivreService);
  allAuthors = signal<Auteur[]>([]);
  selectedAuthors = signal<Auteur[]>([]);
  bookDetails = computed(() => {
    const details = this.bookRelation().get(this.book().id);
    if (details !== null) return details!.details;
    return [];
  });
  subscription: Subscription;
  toggleAuthors = signal(false);
  toggleBookView = signal(false);
  toggleUpdateBook = signal(false);
  books = signal<Livre[]>([]);
  book = signal<Livre>(emptyBook);
  bookDetail = signal<DetailsLivre>(emptyBookDetail);
  bookRelation = computed(() => {
    const map = new Map<number, bookDetails>();
    this.books().map((book) => {
      map.set(book.id, {
        auteurs: book.auteurs,
        details: book.details,
        description: book.description,
        genre: book.genre,
        image: book.image,
      });
    });
    return map;
  });
  displayBooks = computed(() => {
    const idk: DisplayBookType[] = [];
    this.books().map((book) => {
      idk.push({
        id: book.id,
        titre: book.titre,
        isbn: book.isbn,
        datePublication: book.datePublication,
        editeur: book.editeur,
        nombrePages: book.nombrePages,
      });
    });
    return idk;
  });

  constructor() {
    this.adminService.getAuteurs().subscribe((res) => this.allAuthors.set(res));
    this.subscription = this.livreService
      .getLivres()
      .subscribe((res) => this.books.set(res));
  }

  toggleSelection(author: Auteur, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (
      checked &&
      this.selectedAuthors().find((res) => res.id === author.id) === undefined
    ) {
      this.selectedAuthors().push(author);
    } else {
      this.selectedAuthors.set(
        this.selectedAuthors().filter((pid) => pid.id !== author.id),
      );
    }
  }

  chooseAuthor() {
    this.toggleAuthors.set(!this.toggleAuthors());
  }

  onViewClick(book: DisplayBookType) {
    const otherDetails = this.bookRelation().get(book.id)!;
    this.book.set({
      ...book,
      auteurs: otherDetails.auteurs,
      details: otherDetails.details,
      description: otherDetails.description,
      genre: otherDetails.genre,
      image: otherDetails.image,
    });
    this.toggleBookView.set(true);
  }

  onUpdateClick(book: DisplayBookType) {
    this.onCancel();
    const other = this.bookRelation().get(book.id)!;
    this.toggleAuthors.set(true);
    this.selectedAuthors.set(other.auteurs);
    this.book.set({
      ...book,
      ...other,
    });
    this.toggleUpdateBook.set(true);
  }

  onUpdateDetailsClick(detail: DetailsLivre) {
    this.bookDetail.set(detail);
  }

  onCancel() {
    this.book.set(emptyBook);
    this.toggleBookView.set(false);
    this.toggleAuthors.set(false);
    this.toggleUpdateBook.set(false);
    this.selectedAuthors.set([]);
    this.bookDetail.set(emptyBookDetail);
  }

  onCancelDetails() {
    this.bookDetail.set(emptyBookDetail);
  }

  onDeleteClick(book: DisplayBookType) {
    if (confirm('Etes vous sure de vouloir supprimer le livre ' + book.titre)) {
      this.subscribe(this.adminService.deleteLivre(book.id));
    }
  }

  onDeleteDetailsClick(detail: DetailsLivre) {
    if (
      confirm(
        "Etes vous sure de vouloir supprimer les details avec l'id " +
          detail.id,
      )
    ) {
      this.subscribe(this.adminService.deleteDetailsLivre(detail.id));
    }
  }

  submitBook() {
    this.book.set({
      ...this.book(),
      auteurs: this.selectedAuthors(),
    });
    if (this.toggleUpdateBook()) {
      this.subscribe(this.adminService.updateLivre(this.book()));
    } else {
      this.subscribe(this.adminService.createLivre(this.book()));
    }
  }

  onSubmitDetails() {
    if (this.toggleUpdateBook() && this.bookDetail().id > 0) {
      this.subscribe(this.adminService.updateDetailsLivre(this.bookDetail()));
    } else {
      this.subscribe(this.adminService.createDetailsLivre(this.bookDetail()));
    }
  }

  private subscribe(obs: Observable<any>) {
    const message: Message = { text: '', type: MessageType.FAILURE };
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
        this.subscription.unsubscribe();
        this.books.set([]);
        this.subscription = this.livreService
          .getLivres()
          .subscribe((res) => this.books.set(res));
        this.onCancel();
        this.toastService.setMessage(message);
      });
  }
}
