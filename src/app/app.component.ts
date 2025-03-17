import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'source-task-fe';

  constructor(private router: Router, private keycloak: KeycloakService) {}

  async ngOnInit(): Promise<void> {
    try {
      const loggedIn = await this.keycloak.isLoggedIn();
      if (loggedIn) {
        const roles = this.keycloak.getUserRoles();
        if (roles.includes('admin')) {
          console.log('User is logged in as admin.');
          this.router.navigate(['/admin-profile']);
        } else {
          console.log('User is logged in as user.');
          this.router.navigate(['/user-profile']);
        }
      } else {
        console.log('User is not logged in.');
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Keycloak initialization failed', error);
      this.router.navigate(['/login']);
    }
  }
}