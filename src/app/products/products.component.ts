import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ProductsService } from './products.service';
import { Product } from './product.model';
import { ProductComponent } from './product/product.component';
import { LoaderComponent } from '../shared/loader/loader.component';
import { FormsModule } from '@angular/forms';
import { debounceTime, Observable, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductComponent, LoaderComponent, FormsModule],
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  productsService = inject(ProductsService);
  destroyRef = inject(DestroyRef);

  products = signal<Product[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');

  searchQuery = signal('');
  filteredProducts = signal<Product[] | undefined>(undefined);

  private searchSubject: Subject<string> = new Subject<string>();

  ngOnInit() {
    this.isFetching.set(true);

    const subscrition = this.productsService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.filteredProducts.set(data);
      },
      error: (error) => this.error.set(error),
      complete: () => this.isFetching.set(false),
    });

    this.destroyRef.onDestroy(() => subscrition.unsubscribe());

    this.searchSubject
      .pipe(
        debounceTime(500),
        switchMap((query) => {
          return new Observable<Product[]>((observer) => {
            const filtered = this.products()?.filter((prod) =>
              prod.title
                .toLocaleLowerCase()
                .startsWith(query.toLocaleLowerCase())
            );
            observer.next(filtered || []);
            observer.complete();
          });
        })
      )
      .subscribe((filtered) => this.filteredProducts.set(filtered));
  }

  onSearch() {
    this.searchSubject.next(this.searchQuery());
  }
}
