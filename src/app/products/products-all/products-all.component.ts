import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {IProduct} from "../shared/interfaces/product.interface";
import {ProductsService} from "../shared/services/products.service";
import {Observable, of, Subject, switchMap, takeUntil} from "rxjs";
import {DialogService} from "primeng/dynamicdialog";
import {AddProductModalComponent} from "../shared/components/add-product-modal/add-product-modal.component";
import {ConfirmationService, MessageService} from "primeng/api";
import {LoaderService} from "../../core/services/loader.service";
import {ChangeIconModalComponent} from "../shared/components/change-icon-modal/change-icon-modal.component";
import {rowsPerPageOptions, sortCols} from "../shared/helpers/helpers";

@Component({
  selector: 'app-products-all',
  templateUrl: './products-all.component.html',
  styleUrls: ['./products-all.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsAllComponent implements OnInit, OnDestroy {

  sortCols = sortCols;
  msgsTypes = {
    added: {severity: 'success', summary: 'Added', detail: 'The product has been successfully added to your favorites'},
    removed: {severity: 'success', summary: 'Removed', detail: 'The product has been successfully removed from the saved'}
  }
  rowsPerPageOptions = rowsPerPageOptions;

  products$: Observable<Array<IProduct>>;

  selectedProductsIds: Array<number>;

  destroy$ = new Subject();

  constructor(private productsService: ProductsService,
              private dialogService: DialogService,
              private confirmationService: ConfirmationService,
              private loaderService: LoaderService,
              private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    this.selectedProductsIds = this.productsService.getSelectedProductsIds() ?? [];
    this.products$ = this.productsService.products$;
  }

  onAddProduct() {
    this.dialogService.open(AddProductModalComponent, {
      header: 'Add Product',
      data: {
        editButtonName: 'Create'
      },
      styleClass: 'custom-add-product-modal'
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
      },
      styleClass: 'custom-add-product-modal'
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
      width: '350px',
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
      header: 'Delete Product',
      acceptButtonStyleClass: 'p-button-sm',
      rejectButtonStyleClass: 'p-button-sm',
      accept: () => {
        this.loaderService.setLoading(true);
        this.productsService.deleteProduct(id)
          .pipe(
            switchMap(res => {
              if(res.status !== 200) return of(null);
              const itemIndex = this.selectedProductsIds.findIndex(_id => _id === id);
              if(itemIndex !== -1) {
                this.selectedProductsIds.splice(itemIndex, 1);
                this.productsService.setSelectedProductsIds(this.selectedProductsIds);
              }
              return this.productsService.getProducts();
            }),
            takeUntil(this.destroy$)
          )
          .subscribe();
      },
      key: 'deleteAllProductsDialog'
    });
  }

  onChangeSelectedProducts(id: number) {
    this.productsService.setSelectedProductsIds(this.selectedProductsIds);
    if(this.selectedProductsIds.includes(id)) {
      this.messageService.clear();
      this.messageService.add({...this.msgsTypes.added, id});
    } else {
      this.messageService.clear();
      this.messageService.add({...this.msgsTypes.removed, id});
    }
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }
}
