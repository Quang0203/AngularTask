// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = `${environment.apiUrl}/product`;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getProductById(productId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${productId}`);
  }

  createProduct(product: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/new-product`, product);
  }

  updateProduct(productId: string, product: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${productId}`, product);
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${productId}`);
  }
}
