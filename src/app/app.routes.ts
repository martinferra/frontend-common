import { Routes } from '@angular/router';
import { appRoutes as customAppRoutes } from '@martinferra/frontend-custom/app/app.routes';

export const appRoutes: Routes = [
  ...customAppRoutes,
  {
    path: 'auth',
    loadChildren: () => import('../lib/auth/auth.routes').then(m => m.authRoutes),
  },
  {
    path: 'admin',
    loadChildren: () => import('../lib/admin/admin.routes').then(m => m.adminRoutes),
  },
];