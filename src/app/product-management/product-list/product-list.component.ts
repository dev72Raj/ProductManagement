import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductService } from '../service/product.service';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { RouterLink } from '@angular/router';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatSliderModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterLink,
    MatMenuTrigger,
    MatMenu,
    MatIcon,
    MatButtonModule
  ],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  dataSource = new MatTableDataSource<Product>(this.filteredProducts);
  displayedColumns: string[] = ['name', 'category', 'price', 'stock', 'rating', 'action'];
  selectedCategory: string = '';
  selectedSubCategory: string = '';
  selectedPrice: number = 0;
  selectedStock: string = '';
  selectedRating: number = 0;
  searchTerm: string = '';
  selectedBrand: string = '';
  selectedStartDate: Date | null = null;
 selectedEndDate: Date | null = null;

 selectedDiscount: number=0;  

  categories: string[] = ['Electronics', 'Clothing', 'Toys', 'Furniture'];
  subCategories: string[] = [];
  brands: string[] = ['Brand A', 'Brand B', 'Brand C'];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  private filterSubject: Subject<void> = new Subject<void>();

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      this.filteredProducts = data;
      this.dataSource.data = data;

      this.filterSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
        this.applyFilters();
      });
    });
  }

  ngAfterViewInit(): void {
    if (this.paginator) this.dataSource.paginator = this.paginator;
    if (this.sort) this.dataSource.sort = this.sort;
  }

  onCategoryChange(): void {
    this.selectedSubCategory = ''; 
    this.selectedBrand = ''; 
    this.subCategories = this.getSubCategoriesForCategory(this.selectedCategory);
    this.applyFilters();
  }

  getSubCategoriesForCategory(category: string): string[] {
    if (category === 'Electronics') {
      return ['Mobile', 'Laptop', 'Accessories'];
    } else if (category === 'Clothing') {
      return ['Shirts', 'Pants', 'Jackets'];
    } else if (category === 'Toys') {
      return ['Action Figures', 'Dolls', 'Puzzles'];
    } else if (category === 'Furniture') {
      return ['Sofa', 'Table', 'Chair'];
    }
    return [];
  }

  applyFilters(): void {
    let filteredData = this.products;

    if (this.selectedCategory) {
      filteredData = filteredData.filter((product) => product.category === this.selectedCategory);
    }
    if (this.selectedSubCategory) {
      filteredData = filteredData.filter((product) => product.subCategory === this.selectedSubCategory);
    }

    if (this.selectedPrice) {
      filteredData = filteredData.filter((product) => product.price <= this.selectedPrice);
    }

    if (this.selectedStock) {
      if (this.selectedStock === 'inStock') {
        filteredData = filteredData.filter((product) => product.inStock === true);
      } else if (this.selectedStock === 'outOfStock') {
        filteredData = filteredData.filter((product) => product.inStock === false);
      }
    }
    
    if (this.selectedRating) {
      filteredData = filteredData.filter((product) => product.rating >= this.selectedRating);
    }

    if (this.selectedBrand) {
      filteredData = filteredData.filter((product) => product.brand === this.selectedBrand);
    }

    if (this.selectedStartDate && this.selectedEndDate) {
      filteredData = filteredData.filter((product) => {
        const productDate = new Date(product.dateAdded);
        return productDate >= this.selectedStartDate! && productDate <= this.selectedEndDate!;
      });
    }

    if (this.selectedDiscount) {
      filteredData = filteredData.filter((product) => product.discount >= this.selectedDiscount!);
    }

    if (this.searchTerm) {
      filteredData = filteredData.filter(
        (product) =>
          product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredProducts = filteredData;
    this.dataSource.data = this.filteredProducts;

    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
  }
} 

