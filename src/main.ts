import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { KeycloakAngularModule, provideKeycloak } from 'keycloak-angular';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule, KeycloakAngularModule),
    provideKeycloak({
      config: {
        url: 'http://localhost:8080',
        realm: 'test',
        clientId: 'test-angular'
      },
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false
      }
    })
  ]
}).catch(err => console.error(err));