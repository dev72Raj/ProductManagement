import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize } from 'rxjs';
import { ProductService } from '../service/product.service';
import { Product } from '../models/product.model';
import { CommonModule } from '@angular/common';
import { MatError, MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatNativeDateModule, MatOption, NativeDateModule } from '@angular/material/core';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatDatepicker, MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserModule } from '@angular/platform-browser';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-product-form',
  imports: [  CommonModule,FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule,
    MatSliderModule,],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
newProduct: Product = {
    id: '',
    name: '',
    category: '',
    subCategory: '',
    description: '',
    price: 0,
    stock: 0,
    rating: 1,
    discount: 0,
    brand: '',
    dateAdded: new Date(),
    images: [],
    inStock: false
  };

  categories = ['Category 1', 'Category 2', 'Category 3']; 
  subCategories = ['Sub-category 1', 'Sub-category 2', 'Sub-category 3']; 
  imagePreview: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    
    if (productId && productId !== 'new') {
      this.productService.getProductById(productId).subscribe((product) => {
        if (product) {
          this.newProduct = { ...product }; 
        } else {
          this.router.navigate(['/product-list']);
        }
      });
    } else {
      // If it's a new product, use the default empty product object
      this.newProduct = {
        id: '',
        name: '',
        category: '',
        subCategory: '',
        description: '',
        price: 0,
        stock: 0,
        rating: 1,
        discount: 0,
        brand: '',
        inStock: true,
        dateAdded: new Date(),
        images: [],
      };
    }
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  addProduct() { 
    if (this.newProduct.id) {
      this.productService.updateProduct(this.newProduct);
      this.router.navigate(['/product-list', this.newProduct.id]);
    } else {
      this.productService.addProduct(this.newProduct);
      this.router.navigate(['/product-list']);
    }
  }
}