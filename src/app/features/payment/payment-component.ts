import { Component } from '@angular/core';
import { PaymentTableComponent } from "./components/payment-table-component/payment-table-component";

@Component({
  selector: 'app-payment-component',
  imports: [PaymentTableComponent],
  templateUrl: './payment-component.html',
  styleUrl: './payment-component.css',
})
export class PaymentComponent {}
