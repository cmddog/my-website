import { Routes } from '@angular/router';
import { CommissionPageComponent } from './components/commission-page/commission-page.component';
import {AboutMeComponent} from './components/about-me/about-me.component';

export const routes: Routes = [
  {
    path: '',
    component: AboutMeComponent,
  },
  {
    path: 'commissions',
    component: CommissionPageComponent,
    title: 'Commissions'
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
