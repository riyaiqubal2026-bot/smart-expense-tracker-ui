import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Register } from './pages/register/register';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';
import { Transactions } from './pages/transactions/transactions';
import { Categories } from './pages/categories/categories';
import { Budgets } from './pages/budgets/budgets';

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
    { path: '**', redirectTo: 'login' }

];