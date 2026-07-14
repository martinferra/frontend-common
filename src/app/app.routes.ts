import { Routes } from '@angular/router';
import { appRoutes as customAppRoutes } from '@martinferra/frontend-custom/app/app.routes';

export const appRoutes: Routes = [
  ...customAppRoutes,
  {
    path: 'auth',
    loadChildren: () => import('@martinferra/frontend-common/auth/auth.routes').then(m => m.authRoutes),
  },
  {
    path: 'admin',
    loadChildren: () => import('@martinferra/frontend-common/admin/admin.routes').then(m => m.adminRoutes),
  },
];