import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { ApiError, ApiResponse, defaultApiError } from '../../models/apiResponse';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { MembershipDetails, RegisterMembership, UpdateMembership } from '../../models/membership.model';

@Service()
export class MembershipService {

    private http = inject(HttpClient);
    private apiUrl = `${environment.api_base_url}/membership`;
    private readonly defaultError = defaultApiError;

    private defineCatchError = ((error: HttpErrorResponse) => {
        const apiError: ApiError = error.error || this.defaultError
        return throwError(() => apiError);
    })

    saveMembership(data: RegisterMembership) : Observable<string> {
        return this.http.post<ApiResponse<string>>(this.apiUrl, data)
                .pipe(
                    map( response => response.data as string),
                    catchError(this.defineCatchError)
                )
    }

    getMembership(id: string) : Observable<MembershipDetails> {
        return this.http.get<ApiResponse<MembershipDetails>>(`${this.apiUrl}/account/${id}`)
                .pipe(
                    map( response => response.data as MembershipDetails),
                    catchError(this.defineCatchError)
                )
    }

    udpateMembership(id: string, data: UpdateMembership) : Observable<void> {
        return this.http.put<ApiResponse<string>>(`${this.apiUrl}/${id}`, data)
                .pipe(
                    // map(response => response.data as string),
                    map(() => {}),
                    catchError(this.defineCatchError)
                )
    }

}
