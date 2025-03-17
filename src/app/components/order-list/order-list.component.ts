import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Thêm import này

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule], // Thêm RouterModule vào đây
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: any[] = [];
  error: string = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe(
      (data: any[]) => { this.orders = data; },
      (err: any) => { this.error = 'Failed to load orders.'; }
    );
  }
}
