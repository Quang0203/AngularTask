import { KeycloakService } from 'keycloak-angular';

export function initializeKeycloak(keycloak: KeycloakService) {
  return async () => {
    await keycloak.init({
      
      config: {
        url: 'http://localhost:8080',  // URL Keycloak
        realm: 'test',                 // Tên Realm
        clientId: 'test-angular',      // Client ID
      },
      initOptions: {
        onLoad: 'login-required',      // Tự động yêu cầu đăng nhập
        checkLoginIframe: false,
        redirectUri: 'http://localhost:4200',  // URL Angular
      },
      bearerExcludedUrls: []
    });
  };
}
