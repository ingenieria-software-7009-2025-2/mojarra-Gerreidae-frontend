import { Routes } from '@angular/router';
import { LoginComponent } from './modules/layout/login/component/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
