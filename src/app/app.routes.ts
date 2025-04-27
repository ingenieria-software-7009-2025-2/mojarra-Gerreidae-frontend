import { Routes } from '@angular/router';
import { LoginComponent } from './modules/usuario/login/login.component';
import { RegisterComponent } from './modules/usuario/register/register.component';
import { TemplateComponent } from './modules/usuario/template/template.component';
import { ProfileComponent } from './modules/usuario/profile/profile.component';
import { authenticationGuard } from './core/auth/authentication.guard';
import { MapaIncidentesComponent } from './modules/incidente/mapa-incidentes/mapa-incidentes.component';
import { AdminPanelComponent } from './modules/administrador/admin-panel/admin-panel.component';

export const routes: Routes = [
  {
    path: '',
    component: TemplateComponent,
    children: [
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'home',
        component: MapaIncidentesComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'admin-panel',
        component: AdminPanelComponent
      },
      { path: 'profile',
        component: ProfileComponent,
        canActivate: [authenticationGuard]
      },
    ]
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];



