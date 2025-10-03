import { Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { CommissionPageComponent } from './components/commission-page/commission-page.component';

export const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
  },
  {
    path: 'commissions',
    component: CommissionPageComponent,
  },
];
