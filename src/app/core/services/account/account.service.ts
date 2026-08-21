import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { ApiError, ApiResponse, defaultApiError } from '../../models/apiResponse';
import { Account, AccountDetails, AccountRegister, AccountUpdate } from '../../models/account.model';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Pagination } from '../../models/paginationResponse.model';

@Service()
export class AccountService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.api_base_url}/account`;
    
    private readonly PAGE = 0;
    private readonly OFFSET = 10;

    private readonly defaultError = defaultApiError;

    private _pagination = signal<Pagination<AccountDetails[]>>({
        content: [],
        totalElements: 0,
        totalPages: 0,
        currentSize: 0
    });

    page = this._pagination.asReadonly();

    private defineCatchError = ((error: HttpErrorResponse) => {
        const apiError: ApiError = error.error || this.defaultError
        return throwError(() => apiError);
    })

    loadPage(page?: number, offset?: number ) : Observable<void> {
        if (!page)
            page = this.PAGE
        if (!offset)
            offset = this.OFFSET

        return this.http.get<ApiResponse<Pagination<AccountDetails[]>>>(`${this.apiUrl}/details/${page}/${offset}`)
            .pipe(
                map(response => response.data as Pagination<AccountDetails[]>),
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

    createAccount(account: AccountRegister) : Observable<void> {
        return this.http.post<ApiResponse<Account>>(this.apiUrl, account)
                .pipe(
                    map(response => {}),
                    tap(_ => this.loadPage()),
                    catchError(this.defineCatchError)
                )
    }

    accountDetails(id: string) : Observable<Account> {
        return this.http.get<ApiResponse<Account>>(`${this.apiUrl}/${id}`)
                .pipe(
                    map(response => response.data as Account),
                    tap(data => data),
                    catchError(this.defineCatchError)
                )
    }

    updateAccount(id: string, accountUpdate: Partial<AccountUpdate>) : Observable<void> {
        return this.http.put<ApiResponse<Account>>(`${this.apiUrl}/${id}`, accountUpdate)
                .pipe(
                    map(response => {}),
                    tap(_ => this.loadPage()),
                    catchError(this.defineCatchError)
                )
    }

    deleteAccount(id: string) : Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`)
                .pipe(
                    map(response => {}),
                    tap(_ => this.loadPage()),
                    catchError(this.defineCatchError)
                )
    }

    deactivateAccount(id: string) : Observable<ApiResponse<void>> {
        return this.http.put<ApiResponse<void>>(`${this.apiUrl}/deactivate/${id}`, {})
                .pipe(
                    tap( _ => {
                        this.loadPage().subscribe()
                    }),
                    catchError(this.defineCatchError)
                )
    }

    filterAccount(field:string, criteria: string): Observable<ApiResponse<Account[]>> {
        return this.http.get<ApiResponse<Account[]>>(`${this.apiUrl}/filter/${field}/${criteria}`)
                .pipe(
                    tap(response => response),
                    catchError(this.defineCatchError)
                )
    }







}
