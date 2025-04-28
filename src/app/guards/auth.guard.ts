import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/data_access/authentication.service';
import { map } from 'rxjs';
import { MessageType } from '../types/Others';
import { ToastService } from '../services/helper/toast.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthenticationService);
  const toastService = inject(ToastService);
  const router = inject(Router);
  return authService.isLoggedIn().pipe(
    map((res) => {
      if (!res || authService.isTokenExpired()) {
        toastService.setMessage({
          text: 'Failed : Veuillez vous authentifier avant de continuer',
          type: MessageType.FAILURE,
        });
        router.navigate(['/login']);
        return false;
      }
      return true;
    }),
  );
};
