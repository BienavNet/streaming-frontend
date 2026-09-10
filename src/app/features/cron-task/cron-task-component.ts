import { Component, inject, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CrontaskService } from '../../core/services/crontask/crontask.service';
import { CronTaskModel } from '../../core/models/crontask.model';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiError } from '../../core/models/apiResponse';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-cron-task-component',
  imports: [CardModule, ConfirmDialogModule, ButtonModule],
  providers: [ConfirmationService], 
  templateUrl: './cron-task-component.html',
  styleUrl: './cron-task-component.css',
})
export class CronTaskComponent implements OnInit {
    private crontaskService = inject(CrontaskService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);
    tasks = signal<CronTaskModel[]>([]);
    
    
    ngOnInit(): void {
        this._loadTasks();
    }

    private _loadTasks() {
        const sub = this.crontaskService.getTasks()
            .subscribe({
                next: (response) => {
                    this.tasks.set(response);
                },
                error(error) {
                    console.log(error);
                }
            })

        return () => sub.unsubscribe();
    }

    onToggleButtonChange(id: string, newStatus: boolean) {
        this.confirmationService.confirm({
            //   target: event ,
                message: `Do you really want to ${newStatus ? 'activate' : 'deactivate'} this task?`,
                header: `${newStatus ? 'Enable' : 'Disable'} Confirmation`,
                icon: 'pi pi-info-circle',
                rejectLabel: 'Cancel',
                rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
                },
                acceptButtonProps: {
                label: `${newStatus ? 'Enable' : 'Disable'}`,
                severity: 'danger'
                },
                accept: () => {
        
                this.crontaskService.changeStatus(id, newStatus).subscribe({
                    next: () => {
                    this.messageService.add({
                        closable: true,
                        summary: `OK - Task ${newStatus ? 'Enabled' : 'Disabled'  }`,
                        severity: "success",
                        detail: `This task has been ${newStatus ? 'enabled' : 'disabled'  } successfully.`
                    })
                    },
                    error: (err: ApiError) => {
                    this.messageService.add({
                        closable: true,
                        summary: `${err.code} Error`,
                        severity: "error",
                        detail: err.message
                    })
                    }
                });
                }
            })
    }
}
