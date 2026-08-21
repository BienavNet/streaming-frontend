import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { ApiError, ApiResponse, defaultApiError } from '../../models/apiResponse';
import { Payment, PaymentRegister } from '../../models/payment.model';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

@Service()
export class PaymentService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.api_base_url}/payment`;
    private defaultError = defaultApiError;

    
    private defineCatchError = ((error: HttpErrorResponse) => {
        const apiError: ApiError = error.error || this.defaultError
        return throwError(() => apiError);
    })
    
    private _payments = signal<Payment[]>([]);
    public payments = this._payments.asReadonly();

    loadPayments(): Observable<Payment[]> {
        return this.http.get<ApiResponse<Payment[]>>(this.apiUrl)
            .pipe(
                map(response => response.data as Payment[]),
                tap(data => this._payments.set(data)),
                catchError((error: HttpErrorResponse) => {
                    const apiError: ApiError = error.error || this.defaultError
                    return throwError(() => apiError);
                })
            )
    }

    createPayment(payment: PaymentRegister): Observable<Payment> {
        return this.http.post<ApiResponse<Payment>>(this.apiUrl, payment)
            .pipe(
                map(response => response.data as Payment),
                tap(data => data),
                catchError((error: HttpErrorResponse) => {
                    const apiError: ApiError = error.error || this.defaultError
                    return throwError(() => apiError);
                })
            )
    }

    getPayment(id: string): Observable<Payment> {
        return this.http.get<ApiResponse<Payment>>(`${this.apiUrl}/${id}`)
            .pipe(
                map(response => response.data as Payment),
                tap(data => data),
                catchError((error: HttpErrorResponse) => {
                    const apiError: ApiError = error.error || this.defaultError
                    return throwError(() => apiError);
                })
            )
    }

    deletePayment(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    const apiError: ApiError = error.error || this.defaultError
                    return throwError(() => apiError);
                })
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
