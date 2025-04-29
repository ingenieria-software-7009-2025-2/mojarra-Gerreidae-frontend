import { Routes } from '@angular/router';
import { LoginComponent } from './modules/usuario/login/login.component';
import { RegisterComponent } from './modules/usuario/register/register.component';
import { TemplateComponent } from './modules/template/template.component';
import { ProfileComponent } from './modules/usuario/profile/profile.component';
import { authenticationGuard } from './core/auth/authentication.guard';
import { MapaIncidentesComponent } from './modules/incidente/mapa-incidentes/mapa-incidentes.component';
import { AdminPanelComponent } from './modules/administrador/admin-panel/admin-panel.component';
import { AdminIncidenteComponent } from './modules/administrador/admin-incidentes/admin-incidente.component';
import { ReportarIncidenteComponent } from './modules/incidente/reportar-incidente/reportar-incidente.component';
import { HomeComponent } from './modules/home/home/home.component';


export const routes: Routes = [
  {
    path: '',
    component: TemplateComponent,
    children: [
      {
        path: '',
        component: HomeComponent 
      },
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
      {
        path: 'adminuser',
        component: AdminPanelComponent,
        canActivate: [authenticationGuard]
      },
      {
        path: 'adminincidente',
        component: AdminIncidenteComponent
      },
      { path: 'report', 
        component: ReportarIncidenteComponent 
      },
      { path: 'profile',
        component: ProfileComponent,
        canActivate: [authenticationGuard]
      },
    ]
  },
  { path: '**', redirectTo: 'map', pathMatch: 'full' }
];



