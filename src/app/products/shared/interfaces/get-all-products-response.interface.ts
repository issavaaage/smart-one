import {IProduct} from './product.interface';

export interface IGetAllProductsResponse {
  limit: number;
  ordering: string;
  products: Array<IProduct>;
  skip: number;
  total: number;
}
