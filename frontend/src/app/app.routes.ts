import { Routes } from '@angular/router';
import { CommissionPageComponent } from './components/commission-page/commission-page.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { NsfwComponent } from './components/nsfw/nsfw.component';

export const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
  },
  {
    path: 'commissions',
    component: CommissionPageComponent,
    title: 'Commissions',
  },
  {
    path: 'nsfw',
    component: NsfwComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
