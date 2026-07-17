import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { ApiError, ApiResponse, defaultApiError } from '../../models/apiResponse';
import { OrderDetails } from '../../models/order.model';
import { catchError, map, Observable, tap, throwError } from 'rxjs';


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

    // createOrder(order: OrderRegister): Observable<string> {
        
    // }

}
