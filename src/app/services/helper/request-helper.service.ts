import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BACKEND_BASE_URL } from '../../utils/Constants';

@Injectable({
  providedIn: 'root',
})
export class RequestHelperService {
  private http = inject(HttpClient);
  constructor() { }

  get(endpoint: string): Observable<any> {
    return this.http.get(`${BACKEND_BASE_URL}${endpoint}`);
  }

  post(endpoint: string, body?: any): Observable<any> {
    return this.http.post(`${BACKEND_BASE_URL}${endpoint}`, body, {
      responseType: 'text',
    });
  }

  delete(endpoint: string): Observable<any> {
    return this.http.delete(`${BACKEND_BASE_URL}${endpoint}`, {
      responseType: 'text',
    });
  }

  put(endpoint: string, body?: any): Observable<any> {
    return this.http.put(`${BACKEND_BASE_URL}${endpoint}`, body, {
      responseType: 'text',
    });
  }
}
