import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/data_access/user.service';
import { map } from 'rxjs';

export const clientAuthGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);
  return userService.getRole().pipe(
    map((res) => {
      const flag = res.toString() === 'CLIENT';
      if (!flag) {
        router.navigate(['/login']);
      }
      return flag;
    }),
  );
};
