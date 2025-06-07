import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { isDevMode, provideCheckNoChangesConfig } from '@angular/core';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideCheckNoChangesConfig({
      exhaustive: true,
      interval: isDevMode() ? 1000 : 5000,
    }),
  ],
}).catch((err) => console.error(err));
