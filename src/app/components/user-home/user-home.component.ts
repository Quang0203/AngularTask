import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common'; 
import {jwtDecode} from 'jwt-decode';
import { KeycloakService } from 'keycloak-angular';

@Component({
    selector: 'app-user-home',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './user-home.component.html',
    styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {
  products: any[] = [];
  orders: any[] = [];
  profile: any = null;
  error: string = '';

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private keycloak: KeycloakService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      // Lấy token sử dụng keycloak.getToken()
      const token = await this.keycloak.getToken();
      console.log('Access Token:', token);

      // Decode token để lấy userId trong trường "sub"
      let decodedToken: any;
      try {
        decodedToken = jwtDecode(token);
        console.log('Decoded token:', decodedToken);
      } catch (err) {
        console.error('Error decoding token:', err);
      }
      const userId = decodedToken ? decodedToken.sub : null;
      if (userId) {
        console.log('UserId from decoded token:', userId);
      } else {
        console.error('User ID not found in token');
      }

      // Lấy thông tin profile từ BE (profile không chứa userId)
      this.authService.getUserProfile().subscribe({
        next: (response: any) => {
          this.profile = response.data;
          console.log('User profile:', this.profile);
          this.loadProducts();
          this.productService.getProducts().subscribe(response => {
            console.log('Response:', response);
          });
          // Sử dụng userId lấy từ token để gọi API đơn hàng
          if (userId) {
            this.loadOrders(userId);
          } else {
            console.error('User ID not available for loadOrders');
          }
        },
        error: err => {
          this.error = err.message || 'Failed to load profile';
        }
      });
    } catch (error) {
      console.error('Error in Keycloak token retrieval:', error);
      this.error = 'Failed to retrieve token';
    }
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: data => { this.products = data; },
      error: err => { this.error = 'Failed to load products'; }
    });
  }

  loadOrders(userId: string): void {
    this.orderService.getOrdersByUserId(userId).subscribe({
      next: data => { this.orders = data; },
      error: err => { this.error = 'Failed to load orders'; }
    });
  }

  goToProfile(): void {
    this.router.navigate(['/user-profile']);
  }

  logout(): void {
    this.keycloak.logout('http://localhost:4200/');
  }
}