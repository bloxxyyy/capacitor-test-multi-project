import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [provideZonelessChangeDetection (), provideRouter(routes)],
};
