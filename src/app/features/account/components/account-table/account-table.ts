import { Component, effect, inject, signal } from '@angular/core';
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { Panel } from "primeng/panel";
import { TableModule } from "primeng/table";
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AccountService } from '../../../../core/services/account/account.service';



import { AccountRegisterForm } from '../account-register-form/account-register-form';
import { AccountDetails } from '../account-details/account-details';
import { AccountStatus } from '../../../../core/models/account.model';


@Component({
  selector: 'app-account-table',
  imports: [AccountRegisterForm, AccountDetails, Panel, TableModule, ButtonModule, ConfirmDialogModule, TagModule],
  providers: [ConfirmationService],
  templateUrl: './account-table.html',
  styleUrl: './account-table.css',
}) 
export class AccountTable {

  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  accountService = inject(AccountService);
  isLoading = signal<boolean>(false)
  errorMessage = signal<string | null>(null)

  isRegisterFormModalOpen = signal<boolean>(false)
  accountDetailsId = signal<string | null>(null);

  isChangeStatusConfirmDialogOpen = signal<boolean>(false);

  constructor() {
    effect(() => {
      this.isLoading.set(true);
      this.errorMessage.set(null)

      this.accountService.loadAccounts().subscribe({
        next: () => {
          this.isLoading.set(false)
        },
        error: (e) => {
          this.isLoading.set(false);
          this.errorMessage.set("An error has occurred when trying to retrieve data from backend.");
          console.error('Error loading data first time', e);
        }
      });
    })
  }

  getSeverity(status: string) {
    switch(status) {
      case("DEACTIVE"): return "danger";
      case("ACTIVE"): return "success";
      default: return "success";
    }
  }

  onRegisterFormModalClick() : void {
    this.isRegisterFormModalOpen.update(old => !old)
  }

  onClickDeactivateAccount(id: string) {

  }

  onClickAccountDetails(id: string) {
    this.accountDetailsId.set(id);
  }

  onCloseAccountDetailsModal() {
    this.accountDetailsId.set(null)
  }

  changeStatusOnClick(event: Event, id: string, currentStatus: AccountStatus) : void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to change the status of this platform?',
      header: 'Modify Confirmation',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
          label: 'Cancel',
          severity: 'secondary',
          outlined: true
      },
      acceptButtonProps: {
          label: 'Modify',
          severity: 'danger'
      },

      accept: () => {
        
        /* Se debe de crear el endpoint y el servicio para volver a activar la cuenta o se puede modificar el endpoint actual solo para que intercambie los estados correspondientes */
        const action = currentStatus === AccountStatus.ACTIVE ? this.accountService.deactivateAccount(id) : this.accountService.deactivateAccount(id);

        action.subscribe({
          next: () => {
            this.messageService.add({
              closable: true,
              summary: 'OK - Status Modified Successfully',
              severity: "success",
              detail: "This status has been changed successfully."
            })
          },
          error: (err: Error) => {
            this.messageService.add({
              closable: true,
              summary: `Error - ${err.cause}`,
              severity: "error",
              detail: err.message
            })
          }
        });
      }

    });
  }
}
