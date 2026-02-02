import { Routes } from '@angular/router';
import { CommissionPageComponent } from './components/commission-page/commission-page.component';
import {TabsComponent} from './components/tabs/tabs.component';

export const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
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
