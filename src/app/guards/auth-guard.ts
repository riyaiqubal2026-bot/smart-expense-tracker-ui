import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.getToken() && !auth.isTokenExpired()) {
  return true;
}

auth.logout();
return router.createUrlTree(['/login']);

  return router.createUrlTree(['/login']);
};