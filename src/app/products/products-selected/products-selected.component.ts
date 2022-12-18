import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {map, Observable, of, Subject, switchMap, takeUntil} from "rxjs";
import {IProduct} from "../shared/interfaces/product.interface";
import {ProductsService} from "../shared/services/products.service";
import {LoaderService} from "../../core/services/loader.service";
import {ConfirmationService} from "primeng/api";
import {rowsPerPageOptions, sortCols} from "../shared/helpers/helpers";

@Component({
  selector: 'app-products-selected',
  templateUrl: './products-selected.component.html',
  styleUrls: ['./products-selected.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsSelectedComponent implements OnInit, OnDestroy {

  sortCols = sortCols;
  rowsPerPageOptions = rowsPerPageOptions;
  products$: Observable<Array<IProduct>>;
  selectedProductsIds: Array<number>;
  destroy$ = new Subject();

  constructor(private productsService: ProductsService,
              private loaderService: LoaderService,
              private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    this.selectedProductsIds = this.productsService.getSelectedProductsIds() ?? [];

    this.products$ = this.productsService.products$
      .pipe(
        map(res => res.filter(product => this.selectedProductsIds.includes(product.id as number)))
      );
  }

  onRemoveFromSelected(id: number) {
    const itemIndex = this.selectedProductsIds.findIndex(_id => _id === id);
    if(itemIndex !== -1) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete the selected product?',
        header: 'Remove Product from selected',
        acceptButtonStyleClass: 'p-button-sm',
        rejectButtonStyleClass: 'p-button-sm',
        accept: () => {
          this.selectedProductsIds.splice(itemIndex, 1);
          this.productsService.setSelectedProductsIds(this.selectedProductsIds);
          this.loaderService.setLoading(true);
          this.productsService.getProducts()
            .pipe(
              takeUntil(this.destroy$)
            )
            .subscribe();
        },
        key: 'deleteSelectedProductsDialog'
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }
}
