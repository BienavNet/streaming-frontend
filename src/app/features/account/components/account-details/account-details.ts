import { Component, computed, effect, inject, input, OnInit, output, signal } from '@angular/core';

import { PanelModule } from 'primeng/panel';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';
import { email, form, required, FormField, disabled } from '@angular/forms/signals';

import { MessageService } from 'primeng/api';
import { AccountService } from '../../../../core/services/account/account.service';

import { Account, AccountUpdate } from '../../../../core/models/account.model';

import { DatePickerModule } from "primeng/datepicker";
import { SelectFilterEvent, SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PlatformService } from '../../../../core/services/platform/platform.service';
import { PaymentService } from '../../../../core/services/payment/payment.service';
import { ApiError, ApiResponse } from '../../../../core/models/apiResponse';
import { debounceTime, distinctUntilChanged, of, Subject, switchMap, takeUntil } from 'rxjs';
import { Platform } from '../../../../core/models/platform.model';
import { Payment } from '../../../../core/models/payment.model';

@Component({
  selector: 'app-account-details',
  imports: [FormsModule, PanelModule, IftaLabelModule, InputTextModule, DialogModule, ButtonModule, ToggleButtonModule, DatePickerModule, SelectModule, FloatLabelModule, FormField],
  templateUrl: './account-details.html',
  styleUrl: './account-details.css',
})
export class AccountDetails implements OnInit {

  //Services
  private messageService = inject(MessageService);
  private accountService = inject(AccountService);
  private platformService = inject(PlatformService);
  private paymentService = inject(PaymentService);
  // Form Definition
  private formModel = signal<AccountUpdate>({
    email: "",
    password: "",
    payment: "",
    platform: ""
  })

  //Load filter debounced
  private filterPlatformInput$ = new Subject<string>();
  private filterPaymentInput$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  //Load platforms signals
  platforms = signal<Platform[]>([]);
  payments = signal<Payment[]>([]);

  formUpdateHasChanged = signal<boolean>(true)


  account = signal<Account | null>(null);
  isLoading = signal<boolean>(false)
  errorMessage = signal<string | null>(null)
  isEditingButton = signal<boolean>(false)

  onCloseModal = output<void>()
  accountId = input.required<string>()



  editForm = form(this.formModel, (schemaPath) => {
    disabled(schemaPath, { when: () => !this.isEditingButton() });
    required(schemaPath.email);
    email(schemaPath.email);
    required(schemaPath.password);
    required(schemaPath.payment);
    required(schemaPath.platform);
  })

  saveEditBtnDisabled = computed<boolean>(() => this.editForm().dirty() && this.editForm().valid())

  ngOnInit() {
    this._loadInfoWhenComponentIsReady();

    //Preload debounced filter
    this._loadDebouncedFilterForPlatform();
    this._loadDebouncedFilterForPayment();
    
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

  private _mapAccountToNewAccountUpdate(account: Account) {
    return {
      email: account.email,
      password: account.password,
      payment: account.payment.id,
      platform: account.platform.id
    }
  }

  private _loadInfoWhenComponentIsReady() {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    const sub = this.accountService.accountDetails(this.accountId()).subscribe({
      next: (account) => {
        this.account.set(account);
        this.isLoading.set(false);
        this.formModel.set(this._mapAccountToNewAccountUpdate(account))
        this.platforms.update(old => [...old, account.platform])
        this.payments.update(old => [...old, account.payment])
      },
      error: (e) => {
        this.isLoading.set(false);
        this.errorMessage.set("An error has occurred when trying to retrieve data from backend.");
        console.error('Error loading data first time', e);
      }
    })

    return () => sub.unsubscribe();
  }

  private _checkAndPristineForm() {
    const currentForm = this.formModel();
    const originalInfo = this.account();

    if (!originalInfo)
      return

    const originalMapped = this._mapAccountToNewAccountUpdate(originalInfo);

    (Object.keys(currentForm) as Array<keyof AccountUpdate>).forEach(key => {
      const field = this.editForm[key];
      if (field && field().dirty && field().dirty() && currentForm[key] === originalMapped[key])
        this.editForm[key]().reset();
    })

  }

  constructor() {
    effect(() => {
      this._checkAndPristineForm();
    })
  }

  onPaymentFilter(event: SelectFilterEvent): void {
    this.filterPaymentInput$.next(event.filter);
  }

  onPlatformFilter(event: SelectFilterEvent): void {
    this.filterPlatformInput$.next(event.filter);
  }

  copyText(text: any) {
    if (!text)
      return
    navigator.clipboard.writeText(text)
      .then(() => this.messageService.add({ severity: 'info', summary: 'Clipboard', detail: 'Text Copied!' }))
      .catch(err => console.error(err))
  }


  onChangeIsEditingButton() {
    if (!this.isEditingButton()) {
      this.resetFormToOriginalState()
    }

    return

  }

  onClickSaveButton() {
    const partialUpdate: Partial<AccountUpdate> = {};

    (Object.keys(this.formModel()) as Array<keyof AccountUpdate>).forEach(key => {

      const fieldState = this.editForm[key];

      if (fieldState && fieldState() && fieldState().dirty())
        (partialUpdate as any)[key] = this.formModel()[key];
    })


    if (Object.keys(partialUpdate).length === 0)
      return

    this.isLoading.set(true);
    this.accountService.updateAccount(this.accountId(), partialUpdate).subscribe({
      next: () => {
        this.isLoading.set(false)
        this.messageService.add({ severity: 'success', summary: 'Account Updated', detail: 'Account has been updated.' });
        this.onCloseModal.emit()
      },
      error: (e) => {
        this.isLoading.set(false);
        this.errorMessage.set("An error has occurred when trying to retrieve data from backend.");
        const backendError = e as ApiError

        this.messageService.add({ severity: 'error', summary: `${backendError?.code} Error`, detail: backendError?.message });
      }
    })
  }

  private resetFormToOriginalState() {
    this.formModel.set(this._mapAccountToNewAccountUpdate(this.account()!))
    this.editForm().reset()
  }

}
