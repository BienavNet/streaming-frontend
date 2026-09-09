import { Component, inject, OnInit, signal } from '@angular/core';
import { TableModule, TablePageEvent } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaymentService } from '../../../../core/services/payment/payment.service';
import { ConfirmationService, MessageService } from 'primeng/api';

import { ApiError } from '../../../../core/models/apiResponse';

@Component({
  selector: 'app-payment-table-component',
  imports: [TableModule, PanelModule, ButtonModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './payment-table-component.html',
  styleUrl: './payment-table-component.css',
})
export class PaymentTableComponent implements OnInit {

  private paymentService = inject(PaymentService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  isLoading = signal<boolean>(false);
  

  page = this.paymentService.page

  ngOnInit(): void {
    this.loadPayments();
  }

  private loadPayments(page?: number, offset?: number) {
    this.isLoading.set(true);

    const sub = this.paymentService.loadPage(page, offset).subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    })

    return () => sub.unsubscribe();
  }

  onPaginationOccurs(e: TablePageEvent) {
    this.loadPayments(e.first, e.rows);
  }

  onClickDeleteBtn(event: Event, id: string) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Do you want really to delete this payment?',
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
  
          this.paymentService.deletePayment(id).subscribe({
            next: () => {
              this.messageService.add({
                closable: true,
                summary: 'OK - Payment Deleted',
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
