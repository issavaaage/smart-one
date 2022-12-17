import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { MenuModule } from "primeng/menu";
import {LoaderService} from "./services/loader.service";
import {SharedModule} from "../shared/shared.module";
import { LoaderComponent } from './components/loader/loader.component';
import {ProgressSpinnerModule} from "primeng/progressspinner";



@NgModule({
    declarations: [
        SideBarComponent,
        LoaderComponent
    ],
    exports: [
        SideBarComponent
    ],
    imports: [
        CommonModule,
        MenuModule,
        SharedModule,
        ProgressSpinnerModule
    ],
    providers: [
        LoaderService
    ]
})
export class CoreModule { }
