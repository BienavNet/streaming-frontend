import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { MembershipService } from '../../../../core/services/membership/membership.service';
import { MembershipDetails, UpdateMembership } from '../../../../core/models/membership.model';
import { form, required, schema, FormField } from '@angular/forms/signals';
import { PlanService } from '../../../../core/services/plan/plan.service';
import { Plan } from '../../../../core/models/plan.model';

@Component({
  selector: 'app-update-membership-component',
  imports: [InputTextModule, FloatLabelModule, DatePickerModule, CheckboxModule, ButtonModule, FormField, SelectModule],
  templateUrl: './update-membership-component.html',
  styleUrl: './update-membership-component.css',
})
export class UpdateMembershipComponent implements OnInit{

  ngOnInit(): void {
    this.preloadDataForm();
  }

  private membershipService = inject(MembershipService);
  private planService = inject(PlanService)
  private messageService = inject(MessageService);

  membershipToUpdate = input.required<MembershipDetails>()
  onClose = output<void>();

  plans = signal<Plan[]>([]);

  updateFormModel = signal<UpdateMembership>({
    isFreeTrial: false,
    membershipBuyDate: new Date(),
    membershipExpireDate: new Date(),
    membershipConfigId: ""
  })

  updateForm = form(this.updateFormModel, (schemaPath) => {
    // required(schemaPath.isFreeTrial),
    required(schemaPath.membershipExpireDate),
    required(schemaPath.membershipBuyDate)
  })

  private preloadDataForm() {
    // const sub = this.membershipService.getMembership(this.membershipId())
    //   .subscribe({
    //     next: (response) => {
    //       this.updateFormModel.set({
    //         isFreeTrial: response.isFreeTrial,
    //         membershipBuyDate: response.membershipBuyDate,
    //         membershipExpireDate: response.membershipExpireDate
    //       })
    //     }
    //   })

    // return () => sub.unsubscribe();
    this.updateFormModel.set({
      isFreeTrial: this.membershipToUpdate().isFreeTrial,
      membershipBuyDate: this.membershipToUpdate().membershipBuyDate,
      membershipExpireDate: this.membershipToUpdate().membershipExpireDate,
      membershipConfigId: this.membershipToUpdate().details.id
    })

    this.planService.getPlansByPlatform(this.membershipToUpdate().details.platform)
        .subscribe({
          next: (response) => {
            this.plans.set(response);
          }
        })
  }

  updateBtnClick() : void {
    if (!this.updateForm().valid()) {
      // var errors = this._getFormErrorMessage()
      // errors.map(error => {

      //   if (!error || error === "")
      //     return

      //   this.messageService.add({
      //     closable: true,
      //     summary: "Form Error",
      //     severity: "error",
      //     detail: error
      //   })
      // })

      // return

      // hay que refactorizar todo esto en shared para poder evitar el boilerplate code 
      console.log("error")
      return
    }

    this.membershipService.udpateMembership(this.membershipToUpdate().id, this.updateFormModel())
        .subscribe({
          next: () => {
            this.messageService.add({
              closable: true,
              summary: 'OK - Account Created Successfully',
              severity: "success",
              detail: "This Account has been created successfully."
            })
            this.onClose.emit();
          },
          error: (err: Error) => {
            console.log('account request error', err)
            this.messageService.add({
              closable: true,
              summary: `Error - ${err.cause}`,
              severity: "error",
              detail: err.message
            })
          }
        })
  }
}
