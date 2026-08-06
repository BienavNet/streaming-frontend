import { Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ORDER_TYPES, OrderRegister } from '../../../../core/models/order.model';
import { AccountService } from '../../../../core/services/account/account.service';
import { AccountDetails } from '../../../../core/models/account.model';
import { form, required, FormField, schema } from '@angular/forms/signals';
import { MessageService } from 'primeng/api';
import { OrderService } from '../../../../core/services/order/order.service';
import { ApiError, ApiResponse } from '../../../../core/models/apiResponse';

@Component({
  selector: 'app-order-register-form',
  imports: [FormsModule, DialogModule, FloatLabelModule, InputTextModule, ButtonModule, DatePickerModule, SelectModule, FormField],
  templateUrl: './order-register-form.html',
  styleUrl: './order-register-form.css',
})
export class OrderRegisterForm implements OnInit {
  
  private orderService = inject(OrderService);
  private accountService = inject(AccountService);
  private messageService = inject(MessageService);
  loading = signal<boolean>(false)
  errorMessage = signal<string>('')
  
  accounts = computed<AccountDetails[]>(this.accountService.accounts)
  orderTypes = ORDER_TYPES

  registerFormSchema = signal<OrderRegister>({
    account: '',
    buyDate: new Date,
    finishDate: new Date,
    orderType: '',
    paymentAmount: NaN, 
    profileAmount: NaN
  })

  registerForm = form(this.registerFormSchema, (schemaPath) => {
    required(schemaPath.account),
    required(schemaPath.buyDate),
    required(schemaPath.finishDate),
    required(schemaPath.orderType),
    required(schemaPath.paymentAmount),
    required(schemaPath.profileAmount)
  })

  onCloseModal = output<void>();


  ngOnInit(): void {
    this._loadAccountsWhenComponentIsReady();
    console.log(this.accounts())
  }

  private _loadAccountsWhenComponentIsReady() {
    this.loading.set(true);

    this.accountService.loadAccounts().subscribe()
  }

  private _getFormErrorMessage(): string[] {
    const form = this.registerForm;
    const message = (Object.keys(form) as Array<keyof OrderRegister>).map(key => (
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

  onSaveOrder() {
    if (!this.registerForm().valid()){
      var errors = this._getFormErrorMessage();

      errors.map(error => {
        if (!error || error === "")
          return

        this._sendNotification("Form Error", "error", error)
      })

      return
    }

    this.orderService.saveOrder(this.registerFormSchema()).subscribe({
      next: (res) => {
        this._sendNotification('OK - Account Created', "success", `Order created successfully with id ${res}` )
        this.onCloseModal.emit();
      },
      error: (error) => {
        var backendError = error as ApiError
        this._sendNotification('Error - API Error', 'danger', `An error has occurred when registering new plan. Details: ${backendError.message}`)
      }
    })

  }

  onClickCloseBtn() : void {
    this.onCloseModal.emit()
  }
}
