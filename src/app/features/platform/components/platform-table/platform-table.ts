import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { Panel } from 'primeng/panel';
import { Platform } from '../../../../core/models/platform.model';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { PlatformService } from '../../../../core/services/platform/platform.service';
import { ButtonModule } from "primeng/button";
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

import { EditPlatformModalComponent} from '../edit-platform-modal/edit-platform-modal';
import { PlatformRegisterForm } from '../platform-register-form/platform-register-form';

import { PlanComponent } from '../../../plan/plan';

@Component({
  selector: 'app-platform-table',
  imports: [EditPlatformModalComponent, PlatformRegisterForm, PlanComponent, Panel, TableModule, SkeletonModule, ButtonModule, ToastModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './platform-table.html',
  styleUrl: './platform-table.css',
})
export class PlatformTable implements OnInit {

  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  // showToast: boolean = false;

  platformSelectedId = signal<string|null>(null)


  platformService = inject(PlatformService);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  platformToEdit = signal<Platform | null>(null);

  isOpenedRegisterForm = signal<boolean>(false);


  ngOnInit(): void {
      this.loadDataFirstTime();
  }

  private loadDataFirstTime(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null)

    this.platformService.loadPlatforms().subscribe({
      next: () => {
        this.isLoading.set(false)
      },
      error: (e) => {
        this.isLoading.set(false);
        this.errorMessage.set("An error has occurred when trying to retrieve data from backend.");
        console.error('Error loading data first time', e);
      }
    });
  }

  showToast(msg: string, summary: string, severity: string): void {
    this.messageService.add({
      closable: true,
      summary: summary,
      severity: severity,
      detail: msg,
      key: "req-toast"
    })
    this.messageService.clear("req-toast")
  }

  openEditPlatformModal(platform: Platform) : void {
    this.platformToEdit.set(platform);
  }

  closeEditPlatformModal() : void {
    this.platformToEdit.set(null);
  }

  closeRegisterPlatformModal() : void {
    this.isOpenedRegisterForm.set(false);
  }


  deletePlatformDialog(event: Event, id: string) {
    if (!id)
      return;
    
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this platform?',
      header: 'Delete Confirmation',
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
        this.platformService.deletePlatform(id).subscribe({
          next: () => {
            this.showToast("Platform has been deleted successfully", 'OK - Platform Deleted', "success")
          },
          error: (err) => {
            console.log('platform request error', err)
            this.showToast(err.message, "Error", "error")
          },
        });
      }

    });

  }

  onClickOpenRegisterForm(): void {
    this.isOpenedRegisterForm.update(value => !value)
  }

  onClickViewPlans(id: string): void {
    this.platformSelectedId.set(id);
  }

  closeViewPlansModal(): void {
    this.platformSelectedId.set(null);
  }


}
