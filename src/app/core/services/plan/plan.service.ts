import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Plan, PlanRegisterModel } from '../../models/plan.model';
import { ApiError, ApiResponse, defaultApiError } from '../../models/apiResponse';

@Service()
export class PlanService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.api_base_url}/membership/config`

    private defaultError = defaultApiError

    getPlansByPlatform(platformId: string) : Observable<Plan[]> {
        return this.http.get<ApiResponse<Plan[]>>(`${this.apiUrl}/platform/${platformId}`)
            .pipe(
                map( response => response.data as Plan[]),
                tap( data => data),
                catchError((error: HttpErrorResponse) => {
                    const apiError: ApiError = error.error || this.defaultError
                    return throwError(() => apiError);
                })
            )
    }

    registerNewPlan(data: PlanRegisterModel) : Observable<string> {
        return this.http.post<ApiResponse<string>>(`${this.apiUrl}`, data)
                .pipe(
                    map(response => response.data as string),
                    tap(data => data),
                    catchError((error: HttpErrorResponse) => {
                        const apiError: ApiError = error.error || this.defaultError
                        return throwError(() => apiError);
                    })
                )
    }

    deletePlan(id: string) : Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    const apiError: ApiError = error.error || this.defaultError
                    return throwError(() => apiError);
                })
            )
    }

    filterPlan(field: string, criteria: string) : Observable<ApiResponse<Plan[]>> {
        return this.http.get<ApiResponse<Plan[]>>(`${this.apiUrl}/filter/${field}/${criteria}`)
    }
}
