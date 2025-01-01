export interface Product {
    id: string;
    name: string;
    category: string;
    subCategory: string;
    price: number;
    stock: number;
    rating: number;
    description: string;
    brand: string;
    discount: number;
    dateAdded: Date;
    inStock: boolean;
    images?: string[];
  }
  