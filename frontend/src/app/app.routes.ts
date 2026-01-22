import { Routes } from '@angular/router';
import { CommissionPageComponent } from './components/commission-page/commission-page.component';
import { TabsComponent } from './components/tabs/tabs.component';
import {AdminLoginComponent} from './components/admin-login/admin-login.component';

export const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
  },
  {
    path: 'commissions',
    component: CommissionPageComponent,
  },
  {
    path: 'admin',
    component: AdminLoginComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
