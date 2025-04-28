import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { RequestHelperService } from '../helper/request-helper.service';
import { UserLogin, UserRegister } from '../../types/Models';
import { JWT_TOKEN_ITEM_NAME } from '../../utils/Constants';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private helper = inject(RequestHelperService);
  constructor() {
    if (
      localStorage.getItem(JWT_TOKEN_ITEM_NAME) !== null &&
      !this.isTokenExpired()
    ) {
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(user: UserLogin): Observable<string> {
    if (this.isTokenExpired()) localStorage.removeItem(JWT_TOKEN_ITEM_NAME);
    return this.helper.post('/login', user).pipe(
      map((response) => {
        if (typeof response === 'string' && response.startsWith('eyJhbGciOi')) {
          localStorage.setItem(JWT_TOKEN_ITEM_NAME, response);
          this.isAuthenticatedSubject.next(true);
          return 'Success : Connexion reussie';
        }
        return 'Failed : La connexion a echoué. Verifiez les informations saisies';
      }),
      catchError(() => {
        return of(
          'Failed : La connexion a echoué. Verifiez les informations saisies',
        );
      }),
    );
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  register(user: UserRegister): Observable<string> {
    return this.helper.post('/register', user).pipe(
      catchError((error: HttpErrorResponse) => {
        return of(error.error);
      }),
    );
  }

  logout(): Observable<string> {
    return this.helper.get('/logout').pipe(
      map(() => {
        if (localStorage.getItem(JWT_TOKEN_ITEM_NAME) !== null) {
          localStorage.removeItem(JWT_TOKEN_ITEM_NAME);
          this.isAuthenticatedSubject.next(false);
          return 'Success : Deconnecté avec succés';
        }
        return '';
      }),
      catchError(() => {
        return of("Failed : Une erreur s'est produite lors de la deconnexion");
      }),
    );
  }

  isTokenExpired(): boolean {
    const token = localStorage.getItem(JWT_TOKEN_ITEM_NAME);
    if (token === null) return false;
    const decoded = jwtDecode(token);
    if (!decoded.exp) return false;
    const expirationDate = decoded.exp * 1000;
    const now = new Date().getTime();
    return expirationDate < now;
  }
}
