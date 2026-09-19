import { Component, input, output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-lateral-menu-component',
  imports: [ButtonModule],
  templateUrl: './lateral-menu-component.html',
  styleUrl: './lateral-menu-component.css',
})
export class LateralMenuComponent {

  currentActiveTab = signal<string>("home");
  currentSelectedTab = output<string>()

  isLateralMenuOpen = input.required<boolean>()

  setCurrentTab(tabClicked: string) : void {
    this.currentActiveTab.set(tabClicked.toLocaleLowerCase());
    this.currentSelectedTab.emit(this.currentActiveTab());
  }

}
