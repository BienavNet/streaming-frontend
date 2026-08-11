import { Component } from '@angular/core';
import { OrderTable } from "./components/order-table/order-table";

@Component({
  selector: 'app-order',
  imports: [OrderTable],
  templateUrl: './order-component.html',
  styleUrl: './order-component.css',
})
export class OrderComponent {}
