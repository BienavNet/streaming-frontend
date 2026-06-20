import { Component, signal } from '@angular/core';
import { PlatformComponent } from '../platform/platform';
import { SplitterModule } from 'primeng/splitter';
import { Button } from "primeng/button";
import { AccountComponent } from "../account/account.component";

@Component({
  selector: 'app-dashboard',
  imports: [SplitterModule, Button, PlatformComponent, AccountComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  currentActiveTab = signal<string>("home");

  isLateralMenuOpen = signal<boolean>(true);

  changeStateLateralMenu() : void {
    this.isLateralMenuOpen.update(old => !old);
  }

  setCurrentTab(tabClicked: string) : void {
    this.currentActiveTab.set(tabClicked.toLocaleLowerCase());
  }


}
