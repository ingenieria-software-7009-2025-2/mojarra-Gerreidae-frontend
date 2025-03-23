import { Routes } from '@angular/router';
import { LoginComponent } from './modules/layout/login/component/login.component';
import { RegisterComponent } from './modules/layout/register/register.component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];



