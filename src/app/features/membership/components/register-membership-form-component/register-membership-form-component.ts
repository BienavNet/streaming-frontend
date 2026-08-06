import { Component, inject, input, OnInit, signal } from '@angular/core';
import { AccountService } from '../../../../core/services/account/account.service';
import { PlanService } from '../../../../core/services/plan/plan.service';
import { Account } from '../../../../core/models/account.model';
import { Plan } from '../../../../core/models/plan.model';
import { MembershipService } from '../../../../core/services/membership/membership.service';
import { MembershipContextService } from '../../../../core/context/membership-context-flow/membership-context-service';

import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';

import { RegisterMembership } from '../../../../core/models/membership.model';
import { disabled, form, required, FormField } from '@angular/forms/signals';
import { MessageService } from 'primeng/api';
import { ApiError } from '../../../../core/models/apiResponse';

@Component({
  selector: 'app-register-membership-form-component',
  imports: [FloatLabelModule, ButtonModule, SelectModule, DatePickerModule, InputTextModule, FormField, CheckboxModule],
  // providers: [MembershipContextService],
  templateUrl: './register-membership-form-component.html',
  styleUrl: './register-membership-form-component.css',
})
export class RegisterMembershipFormComponent implements OnInit {

  private accountService = inject(AccountService);
  private planService = inject(PlanService);
  private membershipService = inject(MembershipService);

  private messageService = inject(MessageService)
  private membershipContextService = inject(MembershipContextService)

  accountId = signal<string>("")
  account = signal<Account | undefined>(undefined);
  plans = signal<Plan[]>([]);

  isLoading = signal<boolean>(false);


  registerFormSchema = signal<RegisterMembership>({
    account: '',
    isFreeTrial: false,
    membershipBuyDate: new Date,
    membershipConfig: '',
    membershipExpireDate: new Date
  })

  registerForm = form(this.registerFormSchema, (schemaPath) => {
    disabled(schemaPath.account),
      // required(schemaPath.isFreeTrial),
      required(schemaPath.membershipBuyDate),
      required(schemaPath.membershipExpireDate),
      required(schemaPath.membershipConfig)
  })



  ngOnInit(): void {
    this.accountId.set(this.membershipContextService.selectedAccountId()!)
    this._loadData()
  }

  onRegisterForm() {
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

    this.membershipService.saveMembership(this.registerFormSchema()).subscribe({
      next: () => {
        this._sendNotification("Membership Created", "success", "Membership has been added to this account successfully.")
      }, 
      error: (e) => {
        var backendError = e as ApiError
        this._sendNotification("API Error", "danger", backendError.message);
      }
    })
  }


  private _loadData() {
    this.isLoading.set(true);
    const sub = this.accountService.accountDetails(this.accountId())
      .subscribe({
        next: (account) => {
          this.isLoading.set(false);
          this.account.set(account);
          this.registerFormSchema.update(old => ({ ...old, account: account.id }))
          this._loadPlans(account.platform.id);
        },
        error: (err) => {
          this.isLoading.set(false);
          console.log(err)
        },
      })

    return () => sub.unsubscribe();
  }

  private _loadPlans(platform: string) {
    const sub = this.planService.getPlansByPlatform(platform)
      .subscribe({
        next: (plans) => {
          this.plans.set(plans)
        },
        error(err) {
          console.log(err);
        },
      })

    return () => sub.unsubscribe();
  }

  private _getFormErrorMessage(): string[] {

    const form = this.registerForm;

    const message = (Object.keys(form) as Array<keyof RegisterMembership>).map(key => (
      form[key]().invalid() ? `${key} - ${form[key]().errorSummary().map(error => (error.kind))}` : ""
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
