import { Routes } from '@angular/router';
import { CommissionPageComponent } from './components/commission-page/commission-page.component';
import { TabsComponent } from './components/tabs/tabs.component';

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
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
