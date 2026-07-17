import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { ApiError, ApiResponse, defaultApiError } from '../../models/apiResponse';
import { Account, AccountDetails, AccountRegister, AccountUpdate } from '../../models/account.model';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

@Service()
export class AccountService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.api_base_url}/account`;

    private readonly defaultError = defaultApiError;

    private _accounts = signal<AccountDetails[]>([]);
    accounts = this._accounts.asReadonly();

    private defineCatchError = ((error: HttpErrorResponse) => {
        const apiError: ApiError = error.error || this.defaultError
        return throwError(() => apiError);
    })

    loadAccounts() : Observable<AccountDetails[]> {
        return this.http.get<ApiResponse<AccountDetails[]>>(`${this.apiUrl}/details`)
                .pipe(
                    map(response => response.data as AccountDetails[]),
                    tap(data => this._accounts.set(data)),
                    catchError(this.defineCatchError)
                )
    }

    createAccount(account: AccountRegister) : Observable<Account> {
        return this.http.post<ApiResponse<Account>>(this.apiUrl, account)
                .pipe(
                    map(response => response.data as Account),
                    tap( data => {
                        this._accounts.update(
                            oldList => [
                                ...oldList,
                                {
                                    id: data.id,
                                    email: data.email,
                                    platformName: data.platform.name,
                                    status: data.status
                                }
                            ]
                        )
                    }),
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

    updateAccount(id: string, accountUpdate: Partial<AccountUpdate>) : Observable<Account> {
        return this.http.put<ApiResponse<Account>>(`${this.apiUrl}/${id}`, accountUpdate)
                .pipe(
                    map(response => response.data as Account),
                    tap(data => {
                        const dataUpdated: AccountDetails = {
                            id: data.id,
                            email: data.email,
                            platformName: data.platform.name,
                            status: data.status
                        }

                        this._accounts.update(oldList => 
                            oldList.map(
                                acc => acc.id === id ? dataUpdated : acc
                            )
                        )
                    }),
                    catchError(this.defineCatchError)
                )
    }

    deleteAccount(id: string) : Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`)
                .pipe(
                    tap( _ => {
                        this._accounts.update(oldList => oldList.filter(acc => acc.id !== id))
                    }),
                    catchError(this.defineCatchError)
                )
    }

    deactivateAccount(id: string) : Observable<ApiResponse<void>> {
        return this.http.put<ApiResponse<void>>(`${this.apiUrl}/deactivate/${id}`, {})
                .pipe(
                    tap( _ => {
                        this.loadAccounts().subscribe()
                    }),
                    catchError(this.defineCatchError)
                )
    }







}
