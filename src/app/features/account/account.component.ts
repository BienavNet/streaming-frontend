import { Component } from '@angular/core';
import { AccountTable } from "./components/account-table/account-table";

@Component({
  selector: 'app-account',
  imports: [AccountTable],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent {}
