import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Thêm import này

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule], // Thêm RouterModule vào đây
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  error: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    console.log('ProductListComponent initialized');
    this.productService.getProducts().subscribe(
      (data: any[]) => { this.products = data; },
      (err: any) => { this.error = 'Failed to load products.'; }
    );
    this.productService.getProducts().subscribe(response => {
      console.log('Response:', response);
    });
  }
}
