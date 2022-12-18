import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {IProduct} from "../shared/interfaces/product.interface";
import {ProductsService} from "../shared/services/products.service";
import {Observable, of, Subject, switchMap, takeUntil} from "rxjs";
import {DialogService} from "primeng/dynamicdialog";
import {AddProductModalComponent} from "../shared/components/add-product-modal/add-product-modal.component";
import {ConfirmationService} from "primeng/api";
import {LoaderService} from "../../core/services/loader.service";
import {ChangeIconModalComponent} from "../shared/components/change-icon-modal/change-icon-modal.component";

@Component({
  selector: 'app-products-all',
  templateUrl: './products-all.component.html',
  styleUrls: ['./products-all.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsAllComponent implements OnInit, OnDestroy {

  rowsPerPageOptions = [5, 10, 20];

  products$: Observable<Array<IProduct>>;

  selectedProductsIds: Array<number>;

  destroy$ = new Subject();

  constructor(private productsService: ProductsService,
              private dialogService: DialogService,
              private confirmationService: ConfirmationService,
              private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    this.selectedProductsIds = this.productsService.getSelectedProductsIds() ?? [];

    this.products$ = this.productsService.products$;
    this.products$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.loaderService.setLoading(false))

    this.loaderService.setLoading(true);
    this.productsService.getProducts()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  onAddProduct() {
    this.dialogService.open(AddProductModalComponent, {
      header: 'Add Product',
      data: {
        editButtonName: 'Create'
      }
    }).onClose
      .pipe(
        switchMap(res => {
          if(!res) return of(null);
          this.loaderService.setLoading(true);
            return this.productsService.addProduct(res);
        }),
        switchMap(res => {
          if(!res) return of(null);
            return this.productsService.getProducts();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  onEditProduct(product: IProduct) {
    this.dialogService.open(AddProductModalComponent, {
      header: 'Edit Product',
      data: {
        product,
        editButtonName: 'Edit'
      }
    }).onClose
      .pipe(
        switchMap(res => {
          if(!res) return of(null);
            this.loaderService.setLoading(true);
            return this.productsService.updateProduct({...product, ...res});
        }),
        switchMap(res => {
          if(!res) return of(null);
            return this.productsService.getProducts();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  onChangeIcon(product: IProduct) {
    this.dialogService.open(ChangeIconModalComponent, {
      header: 'Change Product icon',
      data: {
        product
      }
    }).onClose
      .pipe(
        switchMap(res => {
          if(!res) return of(null);
            this.loaderService.setLoading(true);
            const formData = new FormData();
            formData.append('file', res);
            return this.productsService.addProductImage(product.id as number, formData);
        }),
        switchMap(res => {
          if(res?.status !== 200) return of(null);
            return this.productsService.getProducts();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  onDeleteProduct(id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected product?',
      accept: () => {
        this.loaderService.setLoading(true);
        this.productsService.deleteProduct(id)
          .pipe(
            switchMap(res => {
              if(res.status !== 200) return of(null);
                return this.productsService.getProducts();
            }),
            takeUntil(this.destroy$)
          )
          .subscribe();
      }
    })
  }

  onChangeSelectedProducts() {
    this.productsService.setSelectedProductsIds(this.selectedProductsIds);
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }
}
