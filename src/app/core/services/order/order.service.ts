import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { ApiError, ApiResponse, defaultApiError } from '../../models/apiResponse';
import { OrderDetails, OrderRegister } from '../../models/order.model';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Order } from '../../models/order.model';


@Service()
export class OrderService {

    private http = inject(HttpClient);
    private apiUrl = `${environment.api_base_url}/order`;

    private readonly defaultError = defaultApiError;

    private _orders = signal<OrderDetails[]>([]);

    orders = this._orders.asReadonly();

    private defineCatchError = ((error: HttpErrorResponse) => {
        const apiError: ApiError = error.error || this.defaultError
        return throwError(() => apiError);
    })

    loadOrders(): Observable<OrderDetails[]> {
        return this.http.get<ApiResponse<OrderDetails[]>>(`${this.apiUrl}/orders`)
                .pipe(
                    map(response => response.data as OrderDetails[]),
                    tap(data => this._orders.set(data)),
                    catchError(this.defineCatchError)
                )
    }

    saveOrder(order: OrderRegister) : Observable<string> {
        return this.http.post<ApiResponse<string>>(this.apiUrl, order)
                .pipe(
                    map(res => res.data as string),
                    catchError(this.defineCatchError)
                )
    }

    getOrderById(orderId: string) : Observable<Order> {
        return this.http.get<ApiResponse<Order>>(`${this.apiUrl}/${orderId}`)
                .pipe(
                    map(response => response.data as Order),
                    catchError(this.defineCatchError)
                )
    }

    // createOrder(order: OrderRegister): Observable<string> {
        
    // }

}
