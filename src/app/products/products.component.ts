import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, takeUntil} from 'rxjs';
import {ProductsService} from "./shared/services/products.service";
import {LoaderService} from "../core/services/loader.service";
import {IProduct} from "./shared/interfaces/product.interface";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit, OnDestroy {

  destroy$ = new Subject();
  products$: Observable<Array<IProduct>>;

  constructor(private productsService: ProductsService,
              private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.getData()
  }

  private getData() {
    this.products$ = this.productsService.products$;

    this.products$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.loaderService.setLoading(false));

    this.loaderService.setLoading(true);
    this.productsService.getProducts()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }
}
