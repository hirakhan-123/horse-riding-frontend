import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authMemberGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loggedUser = localStorage.getItem('loginUser');

  if (loggedUser) {
    return true; // User is logged in, grant access
  } else {
    router.navigateByUrl('/loginMember'); // Redirect to member login
    return false; // Block access
  }
};
