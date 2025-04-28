import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './guards/auth.guard';
import { clientAuthGuard } from './guards/client-auth.guard';
import { adminAuthGuard } from './guards/admin-auth.guard';
import { CartComponent } from './pages/cart/cart.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminComponent } from './pages/admin/admin.component';
import { BooksComponent } from './pages/books/books.component';
import { BookDetailsComponent } from './pages/book-details/book-details.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'books',
    children: [
      {
        path: '',
        component: BooksComponent,
      },
      {
        path: 'details',
        component: BookDetailsComponent,
      },
    ],
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [authGuard, clientAuthGuard],
  },
  {
    path: 'profile',
    children: [
      { path: '', component: ProfileComponent },
      { path: 'favoris', component: ProfileComponent },
    ],
    canActivate: [authGuard, clientAuthGuard],
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, adminAuthGuard],
  },
  {
    path: 'about-us',
    component: AboutUsComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
];
