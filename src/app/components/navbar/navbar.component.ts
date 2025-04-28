import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Message, MessageType } from '../../types/Others';
import { ToastService } from '../../services/helper/toast.service';
import { AuthenticationService } from '../../services/data_access/authentication.service';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/data_access/user.service';
import { Utilisateur } from '../../types/Models';
import { UserRole } from '../../types/AttributeTypes';
import { NgClass } from '@angular/common';
import { SearchService } from '../../services/helper/search.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, FormsModule, NgClass],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  authService = inject(AuthenticationService);
  userService = inject(UserService);
  toastService = inject(ToastService);
  searchService = inject(SearchService);
  router = inject(Router);
  isLoggedIn = signal(false);
  isMenuOpen = signal(false);
  isProfileMenuOpen = signal(false);
  currentUser = signal<Utilisateur>({
    id: 0,
    nomUtilisateur: '',
    email: '',
    role: UserRole.CLIENT,
  });
  search = signal('');

  constructor() {
    this.authService.isLoggedIn().subscribe((isLoggedIn) => {
      this.isLoggedIn.set(isLoggedIn);
      this.userService
        .getUser()
        .subscribe((user) => this.currentUser.set(user));
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

  onSearchClick() {
    const word = this.search();
    this.searchService.setSearchWord(word);
    if (word.length > 0) {
      this.router.navigate(['/books']);
    }
  }

  onMenuClick() {
    this.isMenuOpen.set(!this.isMenuOpen());
    this.isProfileMenuOpen.set(false);
  }

  onMenuClose() {
    this.closeEverything();
    this.isMenuOpen.set(false);
  }

  onProfileMenuClick() {
    this.isProfileMenuOpen.set(!this.isProfileMenuOpen());
    this.isMenuOpen.set(false);
  }

  closeEverything() {
    if (this.isMenuOpen()) this.isMenuOpen.set(false);
    if (this.isProfileMenuOpen()) this.isProfileMenuOpen.set(false);
  }
}
