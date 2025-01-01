import { Routes } from '@angular/router';
import { ProductListComponent } from './product-management/product-list/product-list.component';
import { ProductDetailsComponent } from './product-management/product-details/product-details.component';
import { ProductFormComponent } from './product-management/product-form/product-form.component';

export const routes: Routes = [
    { path: '', redirectTo: '/product-list', pathMatch: 'full' },
    { path: 'product-list', component: ProductListComponent},
    { path: 'product-list/:id', component: ProductDetailsComponent },
    { path: 'product/add', component: ProductFormComponent },
    { path: 'products/edit/:id', component: ProductFormComponent }
];
