import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  private apiUrl = '/product.json'; 
  private productsSubject = new BehaviorSubject<Product[]>([]); 

  constructor(private http: HttpClient) {
    this.loadProducts(); 
  }

  private loadProducts(): void {
    this.http.get<Product[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('loadProducts failed:', error.message);
        return of([]);
      })
    ).subscribe((products) => {
      this.productsSubject.next(products);
    });
  }

  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }


  getProductById(id: string): Observable<Product | null> {
    return this.productsSubject.asObservable().pipe(
      map(products => products.find(product => product.id == id) || null),
      catchError(error => {
        console.error('getProductById failed:', error.message);
        return of(null); 
      })
    );
  }


  updateProduct(updatedProduct: Product): void {
    const currentProducts = this.productsSubject.getValue();
    const index = currentProducts.findIndex(p => p.id === updatedProduct.id);
    
    if (index !== -1) {
      currentProducts[index] = updatedProduct; 
      this.productsSubject.next(currentProducts);
    } else {
      console.error('Product not found for update');
    }
  }

  addProduct(newProduct: Product): void {
    const currentProducts = this.productsSubject.getValue();
    currentProducts.push(newProduct); 
    this.productsSubject.next(currentProducts); 
  }

}