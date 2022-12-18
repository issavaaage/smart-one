import {FormControl, Validators} from '@angular/forms';

export interface IProductModalForm {
  title: FormControl<string | null>;
  price: FormControl<number | null>;
  brand: FormControl<string | null>;
  category: FormControl<string | null>;
  description: FormControl<string | null>;
}
