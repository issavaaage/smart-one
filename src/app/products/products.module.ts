import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProductsRoutingModule} from './products-routing.module';
import {ProductsAllComponent} from './products-all/products-all.component';
import {ProductsSelectedComponent} from './products-selected/products-selected.component';
import {TableModule} from 'primeng/table';
import {ProductsService} from './shared/services/products.service';
import {HttpClientModule} from '@angular/common/http';
import {SharedModule} from '../shared/shared.module';
import {ButtonModule} from 'primeng/button';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {AddProductModalComponent} from './shared/components/add-product-modal/add-product-modal.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CheckboxModule} from 'primeng/checkbox';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ChangeIconModalComponent} from './shared/components/change-icon-modal/change-icon-modal.component';
import {FileUploadModule} from 'primeng/fileupload';
import {AnimateModule} from 'primeng/animate';
import {ProductsComponent} from './products.component';
import {ToastModule} from 'primeng/toast';

@NgModule({
  declarations: [
    ProductsAllComponent,
    ProductsSelectedComponent,
    AddProductModalComponent,
    ChangeIconModalComponent,
    ProductsComponent,
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    TableModule,
    HttpClientModule,
    SharedModule,
    ButtonModule,
    DynamicDialogModule,
    ReactiveFormsModule,
    CheckboxModule,
    FormsModule,
    OverlayPanelModule,
    ConfirmDialogModule,
    FileUploadModule,
    AnimateModule,
    ToastModule,
  ],
  providers: [ProductsService, ConfirmationService, MessageService],
})
export class ProductsModule {}
