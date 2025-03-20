import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { KeycloakService } from 'keycloak-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
  orders: any[] = [];
  products: any[] = [];
  error: string = '';
  tasks = [
    { label: 'Thống kê', route: '/dashboard' },
    { label: 'Quản lý người dùng', route: '/user-management' },
    { label: 'Đơn hàng', route: '/orders' },
    { label: 'Sản phẩm', route: '/products' }
  ];

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private router: Router,
    private keycloak: KeycloakService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadProducts();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: data => { this.orders = data; },
      error: err => { this.error = 'Failed to load orders'; }
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: data => { this.products = data; },
      error: err => { this.error = 'Failed to load products'; }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}