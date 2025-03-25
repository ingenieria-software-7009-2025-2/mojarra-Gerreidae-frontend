import { Routes } from '@angular/router';
import { LoginComponent } from './modules/layout/login/component/login.component';
import { RegisterComponent } from './modules/layout/register/register.component';
import { TemplateComponent } from './modules/layout/template/template.component';

export const routes: Routes = [
  {
    path: '',
    component: TemplateComponent,
    children: [
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];



