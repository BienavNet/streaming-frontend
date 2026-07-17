import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PlanService } from '../../../../core/services/plan/plan.service';
import { PlanRegisterModel } from '../../../../core/models/plan.model';
import { form, required, FormField, disabled } from '@angular/forms/signals';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { ApiError } from '../../../../core/models/apiResponse';

@Component({
  selector: 'app-register-plan-form',
  imports: [FloatLabelModule, ButtonModule, InputTextModule, FormField],
  templateUrl: './register-plan-form.html',
  styleUrl: './register-plan-form.css',
})
export class RegisterPlanForm implements OnInit {
  
  private planService = inject(PlanService);
  private messageService = inject(MessageService)

  platformId = input.required<string>();
  closeForm = output<void>();
  
  registerPlanModel = signal<PlanRegisterModel>({
    plan: '',
    platform: '',
    profiles: NaN
  })

  registerForm = form(this.registerPlanModel, (schemaPath) => {
    disabled(schemaPath.platform),
    required(schemaPath.plan),
    required(schemaPath.profiles)
  })
  
  
  ngOnInit(): void {
    this.registerPlanModel().platform = this.platformId();
  }

  onClickSavePlan() : void {
    if (!this.registerForm().valid()) {
      var errors = this._getFormErrorMessage()
      errors.map(error => {

        if (!error || error === "")
          return

        this.messageService.add({
        closable: true,
        summary: "Form Error",
        severity: "error",
        detail: error
      })
      })
      
      return
    }

    this.planService.registerNewPlan(this.registerPlanModel()).subscribe({
      next: (id) => {
        this._sendNotification('OK - Plan Registered', 'success', `New plan has been registered with id ${id}`)

        this.closeForm.emit();

      },
      error: (error) => {
        var backendError = error as ApiError
        this._sendNotification('Error - API Error', 'danger', `An error has occurred when registering new plan. Details: ${backendError.message}`)
      }
    })
  }


  private _getFormErrorMessage(): string[] {
  
      const form = this.registerForm;
  
      const message = (Object.keys(form) as Array<keyof PlanRegisterModel>).map(key => (
        form[key]().invalid() ? `${key} - ${form[key]().errorSummary().map( error => (error.kind))}` : ""
      ))
  
      return message;
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
