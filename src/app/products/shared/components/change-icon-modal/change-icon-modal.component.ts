import { Component, OnInit } from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {IProduct} from "../../interfaces/product.interface";

@Component({
  selector: 'app-change-icon-modal',
  templateUrl: './change-icon-modal.component.html',
  styleUrls: ['./change-icon-modal.component.scss']
})
export class ChangeIconModalComponent implements OnInit {

  imgPath?: string | ArrayBuffer | null;

  constructor(public ref: DynamicDialogRef,
              public config: DynamicDialogConfig<{product?: IProduct}>) { }

  ngOnInit(): void {
  }

  onSelectFile(event: {currentFiles: Array<File>}) {
    console.log(event);
    const file = event.currentFiles[0]
    const reader = new FileReader();

    reader.onload = (event) => {
      this.imgPath = event.target?.result;
    }

    reader.readAsDataURL(file);
  }

  get isShowImage() {
    return !!this.config.data?.product?.image || !!this.imgPath;
  }

  get src() {
    return this.config.data?.product?.image || this.imgPath;
  }
}
