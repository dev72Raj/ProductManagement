import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../service/product.service';
import { Product } from '../models/product.model';
import { Observable, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card'; 

@Component({
  selector: 'app-product-details',
  imports: [CommonModule,MatCardModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
    product$: Observable<Product | null> = new Observable(); 
  
    constructor(
      private route: ActivatedRoute,
      private productService: ProductService
    ) {}
  
    ngOnInit(): void {
      this.product$ = this.route.paramMap.pipe(
        switchMap((params) => {
          const productId = params.get('id');
          if (productId) {
            return this.productService.getProductById(productId);
          } else {
            return new Observable<Product | null>();
          }
        })
      );
    }
  }