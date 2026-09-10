import { Component, inject, OnInit, signal } from '@angular/core';

import { TableModule, TablePageEvent } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';

import { OrderRegisterForm } from '../order-register-form/order-register-form';
import { OrderDetailsComponent } from '../order-details-component/order-details-component';
import { OrderService } from '../../../../core/services/order/order.service';
import { ConfirmationService } from 'primeng/api';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-order-table',
  imports: [TableModule, ConfirmDialogModule, PanelModule, ButtonModule, OrderRegisterForm, OrderDetailsComponent, TagModule],
  providers: [ConfirmationService],
  templateUrl: './order-table.html',
  styleUrl: './order-table.css',
})
export class OrderTable implements OnInit {
  
  
  private orderService = inject(OrderService);
  isLoading = signal<boolean>(false);
  
  isAddNewClicked = signal<boolean>(false)
  showOrderDetailsId = signal<string | null>(null);

  page = this.orderService.page

  private loadOrders(page?: number, offset?: number) {
    this.isLoading.set(true);
    const sub = this.orderService.loadPage(page, offset).subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }  
    })

    return () => sub.unsubscribe();
  }


  onPaginationOccurs(e: TablePageEvent) {
    this.loadOrders(e.first, e.rows);
  }
  
  
  ngOnInit(): void {
    this.loadOrders();
  }
  
  onClickNewBtn() : void {
    this.isAddNewClicked.update(old => !old)
  }
  onClickShowInfoBtn(id: string) : void {
    this.showOrderDetailsId.set(id);
  }

  onCloseDetailsModal(): void {
    this.showOrderDetailsId.set(null);
  }
}
