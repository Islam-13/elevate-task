import { Component, input } from '@angular/core';
import { Product } from '../product.model';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './product.component.html',
})
export class ProductComponent {
  product = input<Product>();
}
