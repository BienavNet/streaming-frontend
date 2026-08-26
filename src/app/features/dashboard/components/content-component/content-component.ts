import { Component, input, output, signal } from '@angular/core';
import { PlatformComponent } from '../../../platform/platform';
import { AccountComponent } from '../../../account/account.component';
import { OrderComponent } from '../../../order/order-component';
import { HomeComponent } from "../home-component/home-component";

@Component({
  selector: 'app-content-component',
  imports: [PlatformComponent, AccountComponent, OrderComponent, HomeComponent],
  templateUrl: './content-component.html',
  styleUrl: './content-component.css',
})
export class ContentComponent {

  currentTab = input.required<string>();
  isLateralMenuOpen = signal<boolean>(true);

  lateralMenuStatus = output<boolean>();

  changeStateLateralMenu() : void {
    this.isLateralMenuOpen.update(old => !old);
    this.lateralMenuStatus.emit(this.isLateralMenuOpen())
  }
}
