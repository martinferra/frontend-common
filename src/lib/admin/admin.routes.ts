import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { OnlyAdminUsersGuard } from './admin-user-guard';

export const adminRoutes: Routes = [
  {
    path: '',
    canActivate: [OnlyAdminUsersGuard], // Guard applied here
    children: [
      {
        path: '',
        component: AdminComponent,
      },
      {
        path: 'userList',
        component: AdminComponent,
      },
    ],
  },
];