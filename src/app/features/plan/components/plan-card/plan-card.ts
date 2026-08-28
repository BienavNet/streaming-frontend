import { Component, inject, input, output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Plan } from '../../../../core/models/plan.model';
import { PlanService } from '../../../../core/services/plan/plan.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiError } from '../../../../core/models/apiResponse';

@Component({
  selector: 'app-plan-card',
  imports: [CardModule, ButtonModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './plan-card.html',
  styleUrl: './plan-card.css',
})
export class PlanCard {

  private planService = inject(PlanService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  planInput = input.required<Plan>()

  onClose = output<void>()

  onClickDeleteBtn(event: Event) : void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Do you want delete this plan?",
      header: "Delete Confirmation",
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
        this._deleteRequest();
      }
    })
  }
  

  private _deleteRequest() : void {
    this.planService.deletePlan(this.planInput().id)
      .subscribe({
        next: () => {
          this._sendNotification('OK - Plan Deleted', "success", "Plan has been deleted successfully.");
          this.onClose.emit()

        }, 
        error: (error) => {
          var backendError = error as ApiError
          this._sendNotification(`Error - ${backendError.code}`, 'danger', `${backendError.message}`)
        }
      })
  }

  private _sendNotification(summary: string, severity: string, message: string): void {
    this.messageService.add({
      closable: true,
      summary: summary,
      severity: severity,
      detail: message
    })
  }

}
