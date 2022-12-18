import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {IProduct} from "../../interfaces/product.interface";
import {ImagesPathPipe} from "../../../../shared/pipes/images-path.pipe";

@Component({
  selector: 'app-change-icon-modal',
  templateUrl: './change-icon-modal.component.html',
  styleUrls: ['./change-icon-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeIconModalComponent implements OnInit {

  imgPath?: string | ArrayBuffer | null;
  private file: File;

  constructor(public ref: DynamicDialogRef,
              public config: DynamicDialogConfig<{product?: IProduct}>,
              private imagesPathPipe: ImagesPathPipe,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  onSelectFile(event: {currentFiles: Array<File>}) {
    this.file = event.currentFiles[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      this.imgPath = event.target?.result;
      this.cdRef.detectChanges();
    }

    reader.readAsDataURL(this.file);
  }

  get isShowImage() {
    return !!this.config.data?.product?.image || !!this.imgPath;
  }

  get isSubmitDisabled() {
    return !this.imgPath;
  }

  get src() {
    const existedImg = this.config.data?.product?.image;
    return this.imgPath? this.imgPath : (existedImg? this.imagesPathPipe.transform(existedImg) : '');
  }

  submit() {
    if(!this.isSubmitDisabled) this.ref.close(this.file);
  }
}
