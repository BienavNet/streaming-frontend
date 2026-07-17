import { Component, computed, effect, inject, output, signal } from '@angular/core';
import { email, form, required } from '@angular/forms/signals';
import { FormField } from '@angular/forms/signals';

import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectChangeEvent, SelectModule } from 'primeng/select';

import { Dialog } from "primeng/dialog";


import { MessageService } from 'primeng/api';
import { PlatformService } from '../../../../core/services/platform/platform.service';
import { Platform } from '../../../../core/models/platform.model';
import { PaymentService } from '../../../../core/services/payment/payment.service';
import { AccountRegister } from '../../../../core/models/account.model';
import { AccountService } from '../../../../core/services/account/account.service';
import { Payment, PaymentRegister } from '../../../../core/models/payment.model';

@Component({
  selector: 'app-account-register-form',
  imports: [
    InputTextModule,
    FloatLabelModule,
    PanelModule,
    ButtonModule,
    FormField,
    DatePickerModule,
    SelectModule,
    CheckboxModule,
    Dialog
  ],
  templateUrl: './account-register-form.html',
  styleUrl: './account-register-form.css',
  standalone: true
})
export class AccountRegisterForm {

  private platformService = inject(PlatformService);
  private paymentService = inject(PaymentService);
  private accountService = inject(AccountService);
  private messageService = inject(MessageService);

  payments = computed(() => {
    const realPayments: Payment[] = this.paymentService.payments();

    return [
      {
        id: "NEW_PAYMENT",
        card: "Add New Payment...",
      },
      ...realPayments
    ]
  });
  platforms = computed(this.platformService.platforms);
  selectedPlatform: Platform | undefined = undefined;
  addNewPaymentIsClicked = signal<boolean>(false);

  onCloseModal = output<void>()

  registerFormModel = signal<AccountRegister>({
    email: '',
    password: '',
    payment: '',
    platform: ''
  })

  registerForm = form(this.registerFormModel, (schemaPath) => {
    required(schemaPath.email),
      email(schemaPath.email),
      required(schemaPath.password),
      required(schemaPath.platform)
  })

  paymentRegisterFormModel = signal<PaymentRegister>({
    bankName: "",
    cvv: "",
    month: "",
    number: "",
    year: ""
  })

  paymentRegisterForm = form(this.paymentRegisterFormModel, (schemaPath) => {
    required(schemaPath.number),
      required(schemaPath.month),
      required(schemaPath.year),
      required(schemaPath.cvv)
  })

  constructor() {
    effect(() => {
      this.platformService.loadPlatforms().subscribe()
      this.paymentService.loadPayments().subscribe()
    })
  }

  addNewPaymentOnClick(): void {
    this.addNewPaymentIsClicked.update(old => !old);
  }

  onChangePaymentSelect(event: SelectChangeEvent) {
    if (event.value === 'NEW_PAYMENT') {
      this.addNewPaymentIsClicked.set(true); // Muestra el sub-formulario

      // Opcional: Limpiamos el valor del field para que no quede "NEW_PAYMENT" en tu modelo
      this.registerFormModel.update(old => ({ ...old, payment: '' }));
    } else {
      // Si elige cualquier otra tarjeta real, ocultamos el formulario de creación
      this.addNewPaymentIsClicked.set(false);
    }
  }

  saveAccountOnClick(): void {
    if (!this.registerForm().valid()){
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

    if (this.addNewPaymentIsClicked()) {
      this.paymentService.createPayment(this.paymentRegisterFormModel()).subscribe({
        next: (payment) => {
          this.registerFormModel().payment = payment.id
          this.saveAccount()
        },
        error: (err: Error) => {
          console.log('payment request error', err)
          this.messageService.add({
            closable: true,
            summary: `Error - ${err.cause}`,
            severity: "error",
            detail: err.message
          })
        },
      })

      return
    }

    console.log(this.registerFormModel())
    this.saveAccount()
  }



  private saveAccount(): void {
    this.accountService.createAccount(this.registerFormModel()).subscribe({
      next: () => {
        this.messageService.add({
          closable: true,
          summary: 'OK - Account Created Successfully',
          severity: "success",
          detail: "This Account has been created successfully."
        })
        this.onCloseModal.emit();
      },
      error: (err: Error) => {
        console.log('account request error', err)
        this.messageService.add({
          closable: true,
          summary: `Error - ${err.cause}`,
          severity: "error",
          detail: err.message
        })
      },
    })
  }

  private _getFormErrorMessage(): string[] {

    const form = this.registerForm;

    const message = (Object.keys(form) as Array<keyof AccountRegister>).map(key => (
      form[key]().invalid() ? `${key} - ${form[key]().errorSummary().map( error => (error.kind))}` : ""
    ))

    return message;
  }
}
