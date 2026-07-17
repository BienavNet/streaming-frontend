import { Component } from '@angular/core';
import { OrderTable } from "./order-table/order-table";

@Component({
  selector: 'app-order',
  imports: [OrderTable],
  templateUrl: './order.html',
  styleUrl: './order.css',
})
export class Order {}
