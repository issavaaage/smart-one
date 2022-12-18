import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {IGetAllProductsResponse} from "../interfaces/get-all-products-response.interface";
import {BehaviorSubject, map, Observable, tap} from "rxjs";
import {IProduct} from "../interfaces/product.interface";
import {IGetProductResponse} from "../interfaces/get-product-response.interface";
import {IAddProductResponse} from "../interfaces/add-product-response.interface";
import {IUpdateProductResponse} from "../interfaces/update-product-response.interface";
import {IAddProductImageResponse} from "../interfaces/add-product-image-response.interface";

@Injectable()
export class ProductsService {

  private selectedProductsIdsKey = 'selectedProductsIds';

  private api = environment.apiUrl;

  private productsBS = new BehaviorSubject<Array<IProduct>>([]);
  products$ = this.productsBS.asObservable();

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Array<IProduct>> {
    //Todo: make url params as func params
    return this.http.get<IGetAllProductsResponse>(`${this.api}/products?limit=0&skip=0&ordering=id`)
      .pipe(
        map(res => res?.products),
        tap(res => this.setProducts(res ?? []))
      );
  }

  getProduct(id: number): Observable<IProduct> {
    return this.http.get<IGetProductResponse>(`${this.api}/product/${id}`)
      .pipe(
        map(res => res.product)
      );
  }

  addProduct(product: IProduct): Observable<IProduct> {
    return this.http.post<IAddProductResponse>(`${this.api}/product`, product)
      .pipe(
        map(res => res.data)
      );
  }

  updateProduct(product: IProduct): Observable<IProduct> {
    return this.http.patch<IUpdateProductResponse>(`${this.api}/product/${product.id}`, product)
      .pipe(
        map(res => res.product)
      );
  }

  addProductImage(id: number, file: FormData): Observable<HttpResponse<IAddProductImageResponse>> {
    return this.http.post<IAddProductImageResponse>(`${this.api}/product/${id}/image`, file, {observe: 'response'});
  }

  deleteProduct(id: number): Observable<HttpResponse<unknown>> {
    return this.http.delete(`${this.api}/product/${id}`, {observe: 'response'});
  }

  setSelectedProductsIds(ids: Array<number>) {
    if(ids) {
      localStorage.setItem(this.selectedProductsIdsKey, JSON.stringify(ids));
    }
  }

  getSelectedProductsIds(): Array<number> | null {
    const stringIds = localStorage.getItem(this.selectedProductsIdsKey);
    if(!stringIds) return null;
    return JSON.parse(stringIds);
  }

  private setProducts(products: Array<IProduct>) {
    this.productsBS.next(products);
  }
}
