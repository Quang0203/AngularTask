// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { initializeKeycloak } from './app/app.config';

bootstrapApplication(AppComponent, {
  providers: [
    // Cấu hình Router
    provideRouter(routes),
    // Import HttpClientModule & KeycloakAngularModule
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(HttpClientModule, KeycloakAngularModule),
    // Khởi tạo Keycloak trước khi chạy app
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
  ],
}).catch(err => console.error(err));
