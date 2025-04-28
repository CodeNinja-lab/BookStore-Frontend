import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserRegister } from '../../types/Models';
import { ToastService } from '../../services/helper/toast.service';
import { Message, MessageType } from '../../types/Others';
import { AuthenticationService } from '../../services/data_access/authentication.service';
import {
  EMAIL_REGEX,
  MINIMUM_PASSWORD,
  MINIMUM_USERNAME,
} from '../../utils/Constants';
import { Router, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  authService = inject(AuthenticationService);
  toastService = inject(ToastService);
  router = inject(Router);
  user = signal<UserRegister>({ username: '', email: '', password: '' });
  confirmPassword = signal('');
  isPasswordRevealed = signal(false);
  revealPassword() {
    this.isPasswordRevealed.set(!this.isPasswordRevealed());
  }
  register() {
    const message: Message = { text: '', type: null };
    if (this.user().username.trim().length < MINIMUM_USERNAME) {
      message.text =
        "Failed : Le nom d'utilisateur doit etre au minimum " +
        MINIMUM_USERNAME +
        ' caratères';
    }
    if (!this.user().email.match(EMAIL_REGEX)) {
      message.text = "Failed : Le format de l'email est incorrecte";
    }
    if (this.user().password.trim().length < MINIMUM_PASSWORD) {
      message.text =
        'Failed : Le mot de passe doit etre au minimum ' +
        MINIMUM_PASSWORD +
        ' caratères';
    }
    if (this.user().password !== this.confirmPassword()) {
      message.text = 'Failed : Les mots de passe saisies sont differents';
    }
    if (message.text.trim().length === 0) {
      this.authService
        .register(this.user())
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
          if (message.type === 0) this.router.navigate(['/login']);
        });
    } else {
      message.type = MessageType.FAILURE;
      this.toastService.setMessage(message);
    }
  }
}
