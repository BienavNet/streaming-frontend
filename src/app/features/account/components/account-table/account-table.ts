import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { Panel } from "primeng/panel";
import { TableModule, TablePageEvent } from "primeng/table";
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AccountService } from '../../../../core/services/account/account.service';



import { AccountRegisterForm } from '../account-register-form/account-register-form';
import { AccountDetails } from '../account-details/account-details';
import { AccountStatus } from '../../../../core/models/account.model';
import { ApiError } from '../../../../core/models/apiResponse';
import { MembershipComponent } from '../../../membership/membership.component';
import { MembershipContextService } from '../../../../core/context/membership-context-flow/membership-context-service';
import { Pagination } from '../../../../core/models/paginationResponse.model';

@Component({
  selector: 'app-account-table',
  imports: [AccountRegisterForm, AccountDetails, MembershipComponent, Panel, TableModule, ButtonModule, ConfirmDialogModule, TagModule],
  providers: [ConfirmationService, MembershipContextService],
  templateUrl: './account-table.html',
  styleUrl: './account-table.css',
})
export class AccountTable implements OnInit {

  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private membershipContextService = inject(MembershipContextService);

  accountService = inject(AccountService);
  isLoading = signal<boolean>(false)
  errorMessage = signal<string | null>(null)

  isRegisterFormModalOpen = signal<boolean>(false)
  accountDetailsId = signal<string | null>(null);

  membershipIdToQuery = signal<string | undefined>(undefined);

  isChangeStatusConfirmDialogOpen = signal<boolean>(false);

  page = this.accountService.page;

  
  private loadData(page?: number, offset?: number) {
    this.isLoading.set(true);
    this.errorMessage.set(null)
    
    this.accountService.loadPage(page, offset).subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (e) => {
        this.isLoading.set(false);
        this.errorMessage.set("An error has occurred when trying to retrieve data from backend.");
        console.error('Error loading data first time', e);
      }
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  onPaginationOccurs(e: TablePageEvent) {
    this.loadData(e.first, e.rows);
  }

  onRegisterFormModalClick(): void {
    this.isRegisterFormModalOpen.update(old => !old)
  }

  onMembershipModalClick(id: string | undefined = undefined): void {
    this.membershipIdToQuery.set(id);
    this.membershipContextService.setSelectedAccount(id!);
  }

  onClickAccountDetails(id: string) {
    this.accountDetailsId.set(id);
  }

  onCloseAccountDetailsModal() {
    this.accountDetailsId.set(null)
  }

  onClickDeleteBtn(event: Event, id: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want really to delete this account?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger'
      },
      accept: () => {

        this.accountService.deleteAccount(id).subscribe({
          next: () => {
            this.messageService.add({
              closable: true,
              summary: 'OK - Account Deleted',
              severity: "success",
              detail: "This status has been deleted successfully."
            })
          },
          error: (err: ApiError) => {
            this.messageService.add({
              closable: true,
              summary: `${err.code} Error`,
              severity: "error",
              detail: err.message
            })
          }
        });
      }
    })
  }
}
