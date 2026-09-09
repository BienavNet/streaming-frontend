import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { ApiError, ApiResponse, defaultApiError } from '../../models/apiResponse';
import { catchError, map, Observable, throwError } from 'rxjs';
import { DashboardData } from '../../models/dashboard.model';

@Service()
export class DashboardService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.api_base_url}/dashboard`;
    private readonly defaultError = defaultApiError

    private defineCatchError = ((error: HttpErrorResponse) => {
        const apiError: ApiError = error.error || this.defaultError
        return throwError(() => apiError);
    })

    loadData() : Observable<DashboardData> {
        return this.http.get<ApiResponse<DashboardData>>(this.apiUrl)
                .pipe(
                    map(response => response.data as DashboardData),
                    catchError(this.defineCatchError)
                );
    }
}
