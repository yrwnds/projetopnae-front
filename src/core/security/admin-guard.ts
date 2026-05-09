import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth-service';

export const adminGuard: CanActivateFn = (route, state) => {

  const user = inject(AuthService);
  const router = inject(Router);

  if(user.getUserRole() === "ADMIN"){
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
