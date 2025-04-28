import { HttpInterceptorFn } from '@angular/common/http';
import { JWT_TOKEN_ITEM_NAME } from '../utils/Constants';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/data_access/authentication.service';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtToken = localStorage.getItem(JWT_TOKEN_ITEM_NAME);
  const authService = inject(AuthenticationService);
  if (jwtToken && !authService.isTokenExpired()) {
    return next(
      req.clone({
        setHeaders: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }),
    );
  }
  return next(req);
};
