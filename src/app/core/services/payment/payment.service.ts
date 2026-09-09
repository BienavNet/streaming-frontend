import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { ApiError, ApiResponse, defaultApiError } from '../../models/apiResponse';
import { Payment, PaymentRegister } from '../../models/payment.model';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Pagination } from '../../models/paginationResponse.model';

@Service()
export class PaymentService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.api_base_url}/payment`;
    private readonly defaultError = defaultApiError;

    private readonly PAGE = 0;
    private readonly OFFSET = 10;

    private _pagination = signal<Pagination<Payment[]>>({
        content: [],
        totalElements: 0,
        totalPages: 0,
        currentSize: 0
    })

    page = this._pagination.asReadonly();

    private defineCatchError = ((error: HttpErrorResponse) => {
        const apiError: ApiError = error.error || this.defaultError
        return throwError(() => apiError);
    })

    loadPage(page?: number, offset?: number): Observable<void> {

        if (!page)
            page = this.PAGE
        if (!offset)
            offset = this.OFFSET


        
        return this.http.get<ApiResponse<Pagination<Payment[]>>>(`${this.apiUrl}/${page}/${offset}`)
            .pipe(
                map(response => response.data as Pagination<Payment[]>),
                tap(data => {
                    this._pagination.set({
                        ...data,
                        currentSize: data.content.length < offset ? data.content.length : offset
                    })
                }),
                map( () => {}), 
                catchError(this.defineCatchError)
            )
    }

    createPayment(payment: PaymentRegister): Observable<Payment> {
        return this.http.post<ApiResponse<Payment>>(this.apiUrl, payment)
            .pipe(
                map(response => response.data as Payment),
                tap(data => data),
                catchError(this.defineCatchError)
            )
    }

    getPayment(id: string): Observable<Payment> {
        return this.http.get<ApiResponse<Payment>>(`${this.apiUrl}/${id}`)
            .pipe(
                map(response => response.data as Payment),
                tap(data => data),
                catchError(this.defineCatchError)
            )
    }

    deletePayment(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`)
            .pipe(
                catchError(this.defineCatchError)
            )
    }

    filterPayment(field: string, criteria: string) : Observable<ApiResponse<Payment[]>> {
        return this.http.get<ApiResponse<Payment[]>>(`${this.apiUrl}/filter/${field}/${criteria}`)
                .pipe(
                    map(response => response),
                    catchError(this.defineCatchError)
                )
    }
}
