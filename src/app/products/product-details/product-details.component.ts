import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  Pipe,
  signal,
} from '@angular/core';
import { ProductsService } from '../products.service';
import { Product } from '../product.model';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [LoaderComponent, CurrencyPipe],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {
  productId = input.required<string>();

  productsService = inject(ProductsService);
  destroyRef = inject(DestroyRef);

  productDetails = signal<Product | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.isFetching.set(true);

    const subscrition = this.productsService
      .getProduct(this.productId())
      .subscribe({
        next: (data) => this.productDetails.set(data),
        error: (error) => this.error.set(error),
        complete: () => this.isFetching.set(false),
      });

    this.destroyRef.onDestroy(() => subscrition.unsubscribe());
  }
}
