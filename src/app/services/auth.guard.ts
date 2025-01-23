import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // Named import

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('authToken');

  // If there's no token in localStorage, redirect to login
  if (!token) {
    router.navigateByUrl('/loginAdmin');
    return false;
  }

  // Decode the token to check expiration
  try {
    const decodedToken: any = jwtDecode(token); // Use jwtDecode function here
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    // If the token is expired, log out and redirect to login
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem('authToken');
      router.navigateByUrl('/loginAdmin');
      return false;
    }
  } catch (error) {
    // If token decoding fails, log out and redirect to login
    localStorage.removeItem('authToken');
    router.navigateByUrl('/loginAdmin');
    return false;
  }

  // If the token exists and is valid, allow access
  return true;
};
