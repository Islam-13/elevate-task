import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from './product.model';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);

  getProducts() {
    return this.http
      .get<Product[]>(`https://fakestoreapi.com/products`)
      .pipe(
        catchError((err) =>
          throwError(
            () =>
              new Error(
                'Something went wrong fetching products, please try again later.'
              )
          )
        )
      );
  }

  getProduct(productId: string) {
    return this.http
      .get<Product>(`https://fakestoreapi.com/products/${productId}`)
      .pipe(
        catchError((err) =>
          throwError(
            () =>
              new Error(
                'Something went wrong fetching this product, please try again later.'
              )
          )
        )
      );
  }
}
