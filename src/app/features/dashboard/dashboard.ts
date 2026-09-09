import { Component, signal } from '@angular/core';
import { SplitterModule } from 'primeng/splitter';

import { LateralMenuComponent } from './components/lateral-menu-component/lateral-menu-component';
import { ContentComponent } from './components/content-component/content-component';

@Component({
  selector: 'app-dashboard',
  imports: [SplitterModule, LateralMenuComponent, ContentComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  lateralMenuStatus = signal<boolean>(true);

  currentTab = signal<string>("home");

  setCurrentTab(tab : string) : void {
    this.currentTab.set(tab);
  }

  setCurrentLateralMenuStatus(status: boolean) : void {
    this.lateralMenuStatus.set(status);
  }
}
