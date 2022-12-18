import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideBarComponent implements OnInit {

  menuItems: Array<MenuItem>;

  constructor() { }

  ngOnInit(): void {
    this.initMenu();
  }

  private initMenu() {
    this.menuItems = [
      {
        label: 'All products',
        routerLink: 'products'
      },
      {
        label: 'Favorites',
        icon: 'pi pi-fw pi-star-fill',
        routerLink: 'products/selected'
      }
    ]
  }
}
