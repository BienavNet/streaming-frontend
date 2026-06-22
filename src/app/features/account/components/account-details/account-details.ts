import { Component, effect, inject, input, output, signal } from '@angular/core';

import { PanelModule } from 'primeng/panel';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { AccountService } from '../../../../core/services/account/account.service';
import { Account } from '../../../../core/models/account.model';

@Component({
  selector: 'app-account-details',
  imports: [PanelModule, IftaLabelModule, InputTextModule, DialogModule, ButtonModule],
  templateUrl: './account-details.html',
  styleUrl: './account-details.css',
})
export class AccountDetails {
  
  private messageService = inject(MessageService);
  private accountService = inject(AccountService);
  account = signal<Account | null>(null);

  isLoading = signal<boolean>(false)
  errorMessage = signal<string | null>(null)

  onCloseModal = output<void>()
  accountId = input.required<string>()

  constructor() {
    effect(() => {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      this.accountService.accountDetails(this.accountId()).subscribe({
        next: (account) => {
          this.account.set(account);
          this.isLoading.set(false);
        },
        error: (e) => {
          this.isLoading.set(false);
          this.errorMessage.set("An error has occurred when trying to retrieve data from backend.");
          console.error('Error loading data first time', e);
        }
      })
    })
  }

  copyText(text: any) {
    if (!text)
      return
    navigator.clipboard.writeText(text)
      .then(() => this.showInfo())
      .catch(err => console.error(err))

  }


  showInfo() {
      this.messageService.add({ severity: 'info', summary: 'Clipboard', detail: 'Text Copied!' });
  }

}
