import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Register } from './pages/register/register';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';
import { Transactions } from './pages/transactions/transactions';
import { Categories } from './pages/categories/categories';
import { Budgets } from './pages/budgets/budgets';
import { Account } from './pages/account/account';
import { Reports } from './pages/reports/reports';
import { Settings } from './pages/settings/settings';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'login',
        component: Login,
        canActivate: [guestGuard]
    },
    {
        path: 'register',
        component: Register,
        canActivate: [guestGuard]
    },
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard]
    },
    {
        path: 'transactions',
        component: Transactions,
        canActivate: [authGuard]
    },
    {
        path: 'categories',
        component: Categories,
        canActivate: [authGuard]
    },
    {
        path: 'budgets',
        component: Budgets,
        canActivate: [authGuard]
    },
    {
        path: 'account',
        component: Account,
        canActivate: [authGuard]
    },
    {
        path: 'reports',
        component: Reports,
        canActivate: [authGuard]
    },
    {
        path: 'settings',
        component:Settings,
        canActivate: [authGuard]
    },
    { path: '**', redirectTo: 'login' }

];