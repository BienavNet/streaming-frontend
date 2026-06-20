import { Component, inject, output, signal } from '@angular/core';
import { form, required } from '@angular/forms/signals';
import { FormField } from '@angular/forms/signals';

import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { Dialog } from "primeng/dialog";
import { PlatformService } from '../../../../core/services/platform/platform.service';
import { PlatformRegister } from '../../../../core/models/platform.model';

import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-platform-register-form',
  imports: [
    InputTextModule,
    FloatLabelModule,
    PanelModule,
    ButtonModule,
    FormField,
    Dialog
],
  templateUrl: './platform-register-form.html',
  styleUrl: './platform-register-form.css',
})
export class PlatformRegisterForm {

  private platformService = inject(PlatformService);
  private messageService = inject(MessageService);

  onCloseModal = output<void>()

  registerFormModel = signal<PlatformRegister>({
    name: '',
    link: '',
    icon: '',
  })

  registerForm = form(this.registerFormModel, (schemePath) => {
    required(schemePath.name, {message: "Name cannot be blank."}),
    required(schemePath.link, {message: "Link cannot be blank."}),
    required(schemePath.icon, {message: "Icon cannot be blank."})
  })

  savePlatform(): void {
    this.platformService.createPlatform(this.registerFormModel()).subscribe({
      next: () => {
        this.messageService.add({
          closable: true,
          summary: 'OK - Platform Created Successfully',
          severity: "success",
          detail: "This platform has been created successfully."
        })
        this.onCloseModal.emit();
      },
       error: (err: Error) => {
        console.log('platform request error', err)
        this.messageService.add({
          closable: true,
          summary: `Error - ${err.cause}`,
          severity: "error",
          detail: err.message
        })
      },
    });
  }
}
