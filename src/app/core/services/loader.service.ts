import {Injectable} from "@angular/core";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {LoaderComponent} from "../components/loader/loader.component";

@Injectable()
export class LoaderService {

  loaderRef: DynamicDialogRef;

  constructor(private dialogService: DialogService) {
  }

  setLoading(turn: boolean) {
    this.loaderRef?.close();
    if(turn) {
      this.loaderRef = this.dialogService.open(LoaderComponent, {
        closable: false,
        showHeader: false,
        styleClass: 'disabled-loader-styles'
      });
    }
  }
}
