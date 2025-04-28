import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserLogin } from '../../types/Models';
import { AuthenticationService } from '../../services/data_access/authentication.service';
import { Message, MessageType } from '../../types/Others';
import { Router, RouterLink } from '@angular/router';
import { NavigationService } from '../../services/helper/navigation.service';
import { ToastService } from '../../services/helper/toast.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  authService = inject(AuthenticationService);
  toastService = inject(ToastService);
  router = inject(Router);
  navigationService = inject(NavigationService);
  user = signal<UserLogin>({ username: '', password: '' });
  previousUrl = signal('');
  isPasswordRevealed = signal(false);

  constructor() {}

  login() {
    const message: Message = { text: '', type: null };
    if (this.user().username.trim().length === 0) {
      message.text = 'Failed : Le champs Username ne doit pas etre vide';
    }
    if (this.user().password.trim().length === 0) {
      message.text = 'Failed : Le champs Password ne doit pas etre vide';
    }
    if (message.text.trim().length === 0) {
      this.authService.login(this.user()).subscribe((res) => {
        message.text =
          "Failed : Une erreur s'est produite lors de la communication avec le serveur, veuillez réessayer";
        if (typeof res === 'string') {
          message.text = res;
          message.type = res.startsWith('Success')
            ? MessageType.SUCCESS
            : MessageType.FAILURE;
        }
        this.toastService.setMessage(message);
        if (message.type === 0) {
          const previousUrl = this.navigationService.getPreviousUrl();
          this.router.navigate(
            previousUrl !== '/register' ? [previousUrl] : ['/'],
          );
        }
      });
    } else {
      message.type = MessageType.FAILURE;
      this.toastService.setMessage(message);
    }
  }

  revealPassword() {
    this.isPasswordRevealed.set(!this.isPasswordRevealed());
  }
}
