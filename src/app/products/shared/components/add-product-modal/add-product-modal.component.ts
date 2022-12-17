import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {IProduct} from "../../interfaces/product.interface";
import {IProductModalForm} from "../../interfaces/product-modal-form.interface";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
  selector: 'app-add-product-modal',
  templateUrl: './add-product-modal.component.html',
  styleUrls: ['./add-product-modal.component.scss']
})
export class AddProductModalComponent implements OnInit {

  form: FormGroup<IProductModalForm>;

  constructor(private fb: FormBuilder,
              public ref: DynamicDialogRef,
              public config: DynamicDialogConfig<{product?: IProduct, editButtonName: string}>) { }

  ngOnInit(): void {
    this.initForm()
  }

  private initForm() {
    this.form = this.fb.group<IProductModalForm>({
      title: this.fb.control(null, [Validators.required]),
      price: this.fb.control(null, [Validators.required, Validators.min(1)]),
      brand: this.fb.control(null, [Validators.required]),
      category: this.fb.control(null, [Validators.required]),
      description: this.fb.control(null, [Validators.required])
    });
    if(this.config.data?.product) this.form.patchValue(this.config.data?.product);
  }

  submit() {
    if(this.form.valid) this.ref.close(this.form.value);
  }
}
