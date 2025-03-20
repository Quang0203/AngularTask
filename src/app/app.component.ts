import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { AuthService, LoginResponse } from './services/auth.service'; // Điều chỉnh đường dẫn nếu cần
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'source-task-fe';

  constructor(
    private router: Router,
    private keycloak: KeycloakService,
    private authService: AuthService
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      // Kiểm tra đã đăng nhập chưa
      const loggedIn = await this.keycloak.isLoggedIn();
      if (loggedIn) {
        const roles = this.keycloak.getUserRoles();
        console.log('User Roles:', roles);
        // Lấy token từ Keycloak
        const token = await this.keycloak.getToken();
        console.log('Access Token:', token);

        // Tạo đối tượng LoginResponse với các thông tin cần thiết
        const loginResponse: LoginResponse = {
          accessToken: token,
          refreshToken: '',  // Nếu có, bạn có thể lấy từ Keycloak hoặc để rỗng
          tokenType: 'Bearer',
          expiresIn: 3600    // Sửa thành thời gian hết hạn thực tế nếu có
        };

        // Gọi API BE để lưu token vào Redis
        this.authService.saveToken(loginResponse).subscribe({
          next: res => {
            console.log('Token saved in BE successfully', res);
            // Sau khi lưu token thành công, chuyển hướng dựa trên role
            if (roles.includes('admin')) {
              console.log('User is logged in as admin.');
              this.router.navigate(['/admin-home']);
            } else {
              console.log('User is logged in as user.');
              this.router.navigate(['/user-home']);
            }
          },
          error: err => {
            console.error('Failed to save token in BE', err);
            // Nếu lưu token không thành công, bạn có thể chuyển hướng mặc định
            this.router.navigate(['/user-home']);
          }
        });
      } else {
        console.log('User is not logged in.');
        await this.keycloak.login();
      }
    } catch (error) {
      console.error('Keycloak initialization failed', error);
      this.router.navigate(['/login']);
    }
  }
}
