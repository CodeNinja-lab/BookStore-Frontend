import { inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private router = inject(Router);
  private previousUrl: string = '';
  private currentUrl: string = '';

  constructor() {
    this.currentUrl = this.router.url;

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.urlAfterRedirects;
      });
  }

  getPreviousUrl(): string {
    return this.previousUrl;
  }

  getCurrentUrl(): string {
    return this.currentUrl;
  }
}
