import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProductsAllComponent} from './products-all/products-all.component';
import {ProductsSelectedComponent} from './products-selected/products-selected.component';
import {ProductsComponent} from './products.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
    children: [
      {
        path: '',
        component: ProductsAllComponent,
      },
      {
        path: 'selected',
        component: ProductsSelectedComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
