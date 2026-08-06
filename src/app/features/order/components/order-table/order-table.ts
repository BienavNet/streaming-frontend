import { Component, inject, OnInit, signal } from '@angular/core';

import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';

import { OrderRegisterForm } from '../order-register-form/order-register-form';
import { OrderService } from '../../../../core/services/order/order.service';
import { OrderDetails } from '../../../../core/models/order.model';

@Component({
  selector: 'app-order-table',
  imports: [TableModule, ConfirmDialogModule, PanelModule, ButtonModule, OrderRegisterForm],
  templateUrl: './order-table.html',
  styleUrl: './order-table.css',
})
export class OrderTable implements OnInit {
  
  
  private orderService = inject(OrderService);
  isLoading = signal<boolean>(false);
  
  isAddNewClicked = signal<boolean>(false)

  orders = signal<OrderDetails[]>([]);
  
  onClickNewBtn() : void {
    this.isAddNewClicked.update(old => !old)
  }
  
  ngOnInit(): void {
    this.isLoading.set(true);
    this.orderService.loadOrders().subscribe({
      next: (value) => {
        this.isLoading.set(false);
        this.orders.set(value);
      },
      error: () => {
        this.isLoading.set(false);
      }  
    })
  }
}
