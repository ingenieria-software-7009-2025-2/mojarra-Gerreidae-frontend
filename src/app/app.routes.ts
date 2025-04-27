import { Routes } from '@angular/router';
import { LoginComponent } from './modules/usuario/login/login.component';
import { RegisterComponent } from './modules/usuario/register/register.component';
import { TemplateComponent } from './modules/usuario/template/template.component';
import { ProfileComponent } from './modules/usuario/profile/profile.component';
import { authenticationGuard } from './core/auth/authentication.guard';
import { MapaIncidentesComponent } from './modules/incidente/mapa-incidentes/mapa-incidentes.component';
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
        path: 'map',
        component: MapaIncidentesComponent
      },
      { 
        path: 'login', 
        component: LoginComponent 
      },
      { path: 'profile', 
        component: ProfileComponent,
        canActivate: [authenticationGuard] 
      },
    ]
  },
  { path: '**', redirectTo: 'mapa', pathMatch: 'full' }
];



