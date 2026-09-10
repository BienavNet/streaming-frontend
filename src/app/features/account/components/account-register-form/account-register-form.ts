import { Component, computed, effect, inject, OnInit, output, signal } from '@angular/core';
import { disabled, email, form, required } from '@angular/forms/signals';
import { FormField } from '@angular/forms/signals';

import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectFilterEvent, SelectModule } from 'primeng/select';

import { Dialog } from "primeng/dialog";


import { MessageService } from 'primeng/api';
import { PlatformService } from '../../../../core/services/platform/platform.service';
import { Platform } from '../../../../core/models/platform.model';
import { PaymentService } from '../../../../core/services/payment/payment.service';
import { AccountRegister } from '../../../../core/models/account.model';
import { AccountService } from '../../../../core/services/account/account.service';
import { Payment, PaymentRegister } from '../../../../core/models/payment.model';
import { debounceTime, distinctUntilChanged, of, Subject, switchMap, takeUntil } from 'rxjs';
import { ApiResponse } from '../../../../core/models/apiResponse';

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
export class AccountRegisterForm implements OnInit {

  private platformService = inject(PlatformService);
  private paymentService = inject(PaymentService);
  private accountService = inject(AccountService);
  private messageService = inject(MessageService);

  private filterPlatformInput$ = new Subject<string>();
  private filterPaymentInput$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  platforms = signal<Platform[]>([]);
  payments = signal<Payment[]>([]);
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
    required(schemaPath.platform),
    disabled(schemaPath.payment, { when: () => this.addNewPaymentIsClicked() });
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


  ngOnInit(): void {
    this._loadDebouncedFilterForPlatform();
    this._loadDebouncedFilterForPayment();
  }

  onPlatformFilter(event: SelectFilterEvent): void {
    this.filterPlatformInput$.next(event.filter);
  }

  onPaymentFilter(event: SelectFilterEvent): void {
    this.filterPaymentInput$.next(event.filter);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addNewPaymentOnClick(): void {
    this.addNewPaymentIsClicked.update(old => !old);
  }

  onChangePaymentSelect() {
    this.addNewPaymentIsClicked.update(old => !old);
  }

  saveAccountOnClick(): void {
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
      form[key]().invalid() ? `${key} - ${form[key]().errorSummary().map(error => (error.kind))}` : ""
    ))

    return message;
  }

  private _loadDebouncedFilterForPlatform(): void {
    this.filterPlatformInput$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((textFilter: string) => {
        if (!textFilter || textFilter.trim().length === 0) {
          return of({ id: '', status: 200, message: '', data: [] } as ApiResponse<Platform[]>);
        }

        return this.platformService.filterPlatform("platform_name", textFilter);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (resultados: ApiResponse<Platform[]>) => {
        this.platforms.set(resultados.data);
      },
      error: (err) => console.error('Error al filtrar:', err)
    });
  }

  private _loadDebouncedFilterForPayment(): void {
    this.filterPaymentInput$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((textFilter: string) => {
        if (!textFilter || textFilter.trim().length === 0) {
          return of({ id: '', status: 200, message: '', data: [] } as ApiResponse<Payment[]>);
        }

        return this.paymentService.filterPayment("payment_number", textFilter);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (results: ApiResponse<Payment[]>) => {
        this.payments.set(results.data);
      },
      error: (err) => console.error('Error al filtrar:', err)
    });
  }
}
