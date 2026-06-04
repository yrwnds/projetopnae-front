import {Routes} from '@angular/router';
import {authGuard} from '../core/security/auth-guard';

export const routes: Routes = [
  {path: '', loadChildren: () => import('../modules/root/root-module').then(m => m.RootModule)},
  {
    path: 'home',
    canActivate: [authGuard],
    loadChildren: () => import('../modules/home/home-module').then(m => m.HomeModule)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () => import('../modules/home/home-module').then(m => m.HomeModule)
  },
  {
    path: 'usuario',
    canActivate: [authGuard],
    loadChildren: () => import('../modules/home/home-module').then(m => m.HomeModule)
  },
  {
    path: 'edital',
    canActivate: [authGuard],
    loadChildren: () => import('../modules/home/home-module').then(m => m.HomeModule)
  },
  {
    path: 'tipoalimenticio',
    canActivate: [authGuard],
    loadChildren: () => import('../modules/home/home-module').then(m => m.HomeModule)
  },
  {
    path: 'cronograma',
    canActivate: [authGuard],
    loadChildren: () => import('../modules/home/home-module').then(m => m.HomeModule)
  },
  {
    path: 'agricultor',
    canActivate: [authGuard],
    loadChildren: () => import('../modules/home/home-module').then(m => m.HomeModule)
  },
  {
    path: 'entrega',
    canActivate: [authGuard],
    loadChildren: () => import('../modules/home/home-module').then(m => m.HomeModule)
  }
];
