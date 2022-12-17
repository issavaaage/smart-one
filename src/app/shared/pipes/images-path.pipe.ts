import {Pipe, PipeTransform} from "@angular/core";
import {environment} from "../../../environments/environment";

@Pipe({
  name: 'imagespath'
})
export class ImagesPathPipe implements PipeTransform {
  baseUrl: string = environment.imagesPath;

  transform(value: string): string {
    return this.baseUrl + value;
  }
}
