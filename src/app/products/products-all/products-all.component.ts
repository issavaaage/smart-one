import {Component, OnDestroy, OnInit} from '@angular/core';
import {IProduct} from "../shared/interfaces/product.interface";
import {ProductsService} from "../shared/services/products.service";
import {finalize, Observable, of, Subject, switchMap, takeUntil} from "rxjs";
import {DialogService} from "primeng/dynamicdialog";
import {AddProductModalComponent} from "../shared/components/add-product-modal/add-product-modal.component";
import {ConfirmationService} from "primeng/api";
import {LoaderService} from "../../core/services/loader.service";
import {ChangeIconModalComponent} from "../shared/components/change-icon-modal/change-icon-modal.component";

@Component({
  selector: 'app-products-all',
  templateUrl: './products-all.component.html',
  styleUrls: ['./products-all.component.scss']
})
export class ProductsAllComponent implements OnInit, OnDestroy {

  products$: Observable<Array<IProduct>>;

  selectedProducts: Array<number>;

  destroy$ = new Subject();

  constructor(private productsService: ProductsService,
              private dialogService: DialogService,
              private confirmationService: ConfirmationService,
              private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
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
      header: 'Change Product icon'
    }).onClose
      .pipe(
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

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }
}
