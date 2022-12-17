import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsSelectedComponent } from './products-selected.component';

describe('ProductsSelectedComponent', () => {
  let component: ProductsSelectedComponent;
  let fixture: ComponentFixture<ProductsSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsSelectedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
