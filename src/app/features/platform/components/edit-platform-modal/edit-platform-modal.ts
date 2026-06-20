import { Component, effect, inject, input, output, signal } from '@angular/core';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { form, FormField, required } from '@angular/forms/signals';
import { Platform, PlatformUpdate } from '../../../../core/models/platform.model';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PlatformService } from '../../../../core/services/platform/platform.service';

import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-edit-platform-modal',
  imports: [
    DialogModule, 
    ButtonModule, 
    FormField,
    InputTextModule,
    FloatLabelModule,
  ],
  providers: [],
  templateUrl: './edit-platform-modal.html',
  styleUrl: './edit-platform-modal.css',
})
export class EditPlatformModalComponent {

  private platformService = inject(PlatformService);
  private messageService = inject(MessageService);

  oldData = input.required<Platform>();
  idToUpdate = input.required<string>();

  onCloseModal = output<void>();
  // onSaveModal = output<{id: string, data: PlatformUpdate}>()
  
  private formModel = signal<PlatformUpdate>({
    name: '',
    link: '',
    icon: ''
  })

  editForm = form(this.formModel)
  
  visible: boolean = true;

  constructor() {
    effect(() => {
      const data = this.oldData();

      this.formModel.set({
        icon: data.icon,
        link: data.link,
        name: data.name
      })
    })
  }

  executeSaveOnClick() {
    // this.onSaveModal.emit({
    //   id: this.idToUpdate(),
    //   data: this.formModel()
    // })
    // this.onCloseModal.emit();
    this.platformService.updatePlatform(this.idToUpdate(), this.formModel()).subscribe({
      next: (response) =>  {
          this.messageService.add({
          closable: true,
          summary: `${response.status} - Platform Updated Successfully`,
          severity: "success",
          detail: response.message
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
    })


  }

}
