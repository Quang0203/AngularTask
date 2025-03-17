// src/app/components/order-detail/order-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html'
})
export class OrderDetailComponent implements OnInit {
  order: any;
  error: string = '';

  constructor(private route: ActivatedRoute, private orderService: OrderService) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if(orderId) {
      this.orderService.getOrderById(orderId).subscribe(
        data => { this.order = data; },
        err => { this.error = 'Failed to load order details.'; }
      );
    }
  }
}
