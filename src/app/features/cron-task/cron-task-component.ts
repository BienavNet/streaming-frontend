import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ToggleButtonModule } from 'primeng/togglebutton';

@Component({
  selector: 'app-cron-task-component',
  imports: [CardModule, ToggleButtonModule],
  templateUrl: './cron-task-component.html',
  styleUrl: './cron-task-component.css',
})
export class CronTaskComponent {
    
}
