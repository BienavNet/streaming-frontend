import { Component } from '@angular/core';

import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-order-table',
  imports: [TableModule, ConfirmDialogModule, PanelModule, ButtonModule],
  templateUrl: './order-table.html',
  styleUrl: './order-table.css',
})
export class OrderTable {}
