import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IftaLabelModule } from 'primeng/iftalabel';
import { OrderService } from '../../../../core/services/order/order.service';
import { Order } from '../../../../core/models/order.model';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-order-details-component',
  imports: [
    DialogModule, 
    IftaLabelModule, 
    ButtonModule,
    InputTextModule,
    MessageModule
  ],
  templateUrl: './order-details-component.html',
  styleUrl: './order-details-component.css',
})
export class OrderDetailsComponent implements OnInit {
  
  private orderService = inject(OrderService);

  isLoading = signal<boolean>(false);

  orderId = input.required<string>()
  onCloseModal = output<void>();


  orderDetails = signal<Order | null>(null);
  
  ngOnInit() {
    this.isLoading.set(true);
    const sub = this.orderService.getOrderById(this.orderId())
                .subscribe({
                  next: (order) => {
                    this.orderDetails.set(order);
                    this.isLoading.set(false);
                  },
                  error: (error) => {
                    // voy a reformar las notificaciones para evitar el boilerplate 
                    console.log(error);
                  }
                })

    return () => sub.unsubscribe();
  }
}
