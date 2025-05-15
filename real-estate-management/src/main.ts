import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers || [], // preserve existing providers from appConfig
    provideHttpClient(),
    provideRouter(routes),
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }, // ✅ Required for JwtHelperService
    JwtHelperService                                  // ✅ Actual service
  ]
})
.catch((err) => console.error(err));
