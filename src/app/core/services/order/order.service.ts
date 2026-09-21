import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { ApiError, ApiResponse, defaultApiError } from '../../models/apiResponse';
import { OrderDetails, OrderRegister } from '../../models/order.model';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Order } from '../../models/order.model';
import { Pagination } from '../../models/paginationResponse.model';


@Service()
export class OrderService {

    private http = inject(HttpClient);
    private apiUrl = `${environment.api_base_url}/order`;

    private readonly PAGE = 0;
    private readonly OFFSET = 10;

    private readonly defaultError = defaultApiError;

    private _pagination = signal<Pagination<OrderDetails[]>>({
        content: [],
        totalElements: 0,
        totalPages: 0,
        currentSize: 0
    })

    // private _orders = signal<OrderDetails[]>([]);
    // orders = this._orders.asReadonly();

    page = this._pagination.asReadonly();


    private defineCatchError = ((error: HttpErrorResponse) => {
        const apiError: ApiError = error.error || this.defaultError
        return throwError(() => apiError);
    })

    loadPage(page?: number, offset?: number, isShowingRecords?: boolean) : Observable<void> {
        if (!page)
            page = this.PAGE
        if (!offset)
            offset = this.OFFSET

        return !isShowingRecords ?
            this._getCurrentOrders(page, offset) :
            this._getOrderRecords(page, offset);

    }

    private _getCurrentOrders(page: number, offset: number): Observable<void> {
        return this.http.get<ApiResponse<Pagination<OrderDetails[]>>>(`${this.apiUrl}/orders/${page}/${offset}`)
            .pipe(
                map(response => response.data as Pagination<OrderDetails[]>),
                tap(data => {
                    this._pagination.set({
                        ...data,
                        currentSize: data.content.length < offset ? data.content.length : offset
                    })
                }),
                map(() => {}),
                catchError(this.defineCatchError)
            )
    }

    private _getOrderRecords(page: number, offset: number): Observable<void> {
        return this.http.get<ApiResponse<Pagination<OrderDetails[]>>>(`${this.apiUrl}/records/${page}/${offset}`)
            .pipe(
                map(response => response.data as Pagination<OrderDetails[]>),
                tap(data => {
                    this._pagination.set({
                        ...data,
                        currentSize: data.content.length < offset ? data.content.length : offset
                    })
                }),
                map(() => {}),
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


}
