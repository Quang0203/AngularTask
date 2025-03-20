import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import {jwtDecode} from 'jwt-decode';
import { CommonModule } from '@angular/common';

interface NavItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  profileName: string = 'User';
  dropdownVisible: boolean = false;
  navItems: NavItem[] = [];

  constructor(private router: Router, private keycloak: KeycloakService) {}

  async ngOnInit(): Promise<void> {
    try {
      const token = await this.keycloak.getToken();
      const decoded: any = jwtDecode(token);
      this.profileName = decoded.name || decoded.preferred_username || 'User';

      // Decode token để lấy userId trong trường "sub"
      const userId = decoded ? decoded.sub : null;
      if (userId) {
        console.log('UserId from decoded token:', userId);
      } else {
        console.error('User ID not found in token');
      }

      // Get roles and set nav menu items accordingly
      const roles = this.keycloak.getUserRoles();
      if (roles.includes('admin')) {
        this.navItems = [
          { label: 'Thống kê', route: '/dashboard' },
          { label: 'Quản lý người dùng', route: '/user-management' },
          { label: 'Đơn hàng', route: '/orders' },
          { label: 'Sản phẩm', route: '/products' }
        ];
      } else {
        this.navItems = [
          { label: 'Sản phẩm', route: '/products' },
          { label: 'Đơn hàng', route: '/orders' },
          { label: 'Home', route: '/user-home' }
        ];
      }
    } catch (err) {
      console.error('Error in header initialization:', err);
    }
  }

  toggleDropdown(): void {
    this.dropdownVisible = !this.dropdownVisible;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.dropdownVisible = false;
  }

  viewProfile(): void {
    if (this.keycloak.getUserRoles().includes('admin')) {
      this.navigateTo('/admin-profile');
    } else {
      this.navigateTo('/user-profile');
    }
  }

  logout(): void {
    this.keycloak.logout('http://localhost:4200');
  }
}