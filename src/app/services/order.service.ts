// src/app/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = `${environment.apiUrl}/order`;

  constructor(private http: HttpClient) { }

  getOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getOrdersByUserId(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${userId}`);
  }

  getOrderById(orderId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${orderId}`);
  }

  createOrder(order: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/new-order`, order);
  }

  updateOrder(orderId: string, order: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${orderId}`, order);
  }

  deleteOrder(orderId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${orderId}`);
  }
}
