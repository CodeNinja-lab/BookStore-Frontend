import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/data_access/user.service';
import { map } from 'rxjs';

export const adminAuthGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);
  return userService.getRole().pipe(
    map((res) => {
      const flag = res.toString() === 'ADMIN';
      if (!flag) {
        router.navigate(['/login']);
      }
      return flag;
    }),
  );
};
