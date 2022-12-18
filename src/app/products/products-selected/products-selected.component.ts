import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {map, Observable} from "rxjs";
import {IProduct} from "../shared/interfaces/product.interface";
import {ProductsService} from "../shared/services/products.service";

@Component({
  selector: 'app-products-selected',
  templateUrl: './products-selected.component.html',
  styleUrls: ['./products-selected.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsSelectedComponent implements OnInit {

  products$: Observable<Array<IProduct>>;
  selectedProductsIds: Array<number>;

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    this.selectedProductsIds = this.productsService.getSelectedProductsIds() ?? [];

    this.products$ = this.productsService.products$
      .pipe(
        map(res => res.filter(product => this.selectedProductsIds.includes(product.id as number)))
      );

    this.productsService.getProducts()
      .subscribe();
  }
}
