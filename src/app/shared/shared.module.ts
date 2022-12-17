import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ImagesPathPipe} from "./pipes/images-path.pipe";
import {DialogService, DynamicDialogModule} from "primeng/dynamicdialog";



@NgModule({
  declarations: [
    ImagesPathPipe
  ],
  imports: [
    CommonModule,
    DynamicDialogModule
  ],
  exports: [
    ImagesPathPipe,
    DynamicDialogModule
  ],
  providers: [
    DialogService,
  ]
})
export class SharedModule { }
