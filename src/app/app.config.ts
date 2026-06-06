import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  Provider,
  provideZoneChangeDetection
} from '@angular/core';
import {provideRouter, withViewTransitions} from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {env} from '../environment/environment.prod';
import {authInterceptor} from '../core/security/auth-interceptor';

export const ENV: Provider = {
  provide: 'ENV',
  useValue: env
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withInterceptors([authInterceptor])),
    ENV
  ]
};
