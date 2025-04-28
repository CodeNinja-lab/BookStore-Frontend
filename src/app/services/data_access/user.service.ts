import { inject, Injectable } from '@angular/core';
import { RequestHelperService } from '../helper/request-helper.service';
import { map, Observable } from 'rxjs';
import { Utilisateur } from '../../types/Models';
import { UserRole } from '../../types/AttributeTypes';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private helper = inject(RequestHelperService);

  constructor() {}

  getUser(): Observable<Utilisateur> {
    return this.helper.get('/api/user');
  }

  getRole(): Observable<UserRole> {
    return this.getUser().pipe(map((res) => res.role));
  }

  changePassword(password: string): Observable<string> {
    return this.helper.post(`/api/user/${password}`);
  }
}
