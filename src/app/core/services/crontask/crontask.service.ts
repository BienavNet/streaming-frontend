import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { ApiError, ApiResponse, defaultApiError } from '../../models/apiResponse';
import { catchError, map, Observable, throwError } from 'rxjs';
import { CronTaskModel } from '../../models/crontask.model';

@Service()
export class CrontaskService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.api_base_url}/crontasks/`;

    private readonly defaultError = defaultApiError;

    private defineCatchError = ((error: HttpErrorResponse) => {
        const apiError: ApiError = error.error || this.defaultError
        return throwError(() => apiError);
    });

    changeStatus(task: string, newStatus: boolean) : Observable<void> {
        return this.http.put<ApiResponse<string>>(`${this.apiUrl}status/${task}/${newStatus}`, {})
                .pipe(
                    map(response => {}),
                    catchError(this.defineCatchError)
                )
    }

    getTasks() : Observable<CronTaskModel[]> {
        return this.http.get<ApiResponse<CronTaskModel[]>>(this.apiUrl)
                .pipe(
                    map(response => response.data as CronTaskModel[]),
                    catchError(this.defineCatchError)
                )
    }
}
