import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNgxStripe } from 'ngx-stripe';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';


export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(),provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),provideNgxStripe('pk_test_51QjbyJQI5UEscutgHYRqjfSFek5VfXVymdy7QtxvpYWvBLosjDNBA0Bz4xnCzEKJHZffAnVNgp8qosTMMYrao95O00FHqQbtvx')]
};
