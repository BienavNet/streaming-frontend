import { inject, Service, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Platform, PlatformRegister, PlatformUpdate } from '../../models/platform.model';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { ApiError, ApiResponse, defaultApiError } from '../../models/apiResponse';

@Service()
export class PlatformService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.api_base_url}/platform`;

    private readonly defaultError = defaultApiError;


    private _platforms = signal<Platform[]>([]);
    public platforms = this._platforms.asReadonly();

    loadPlatforms() : Observable<Platform[]> {
        return this.http.get<ApiResponse<Platform[]>>(`${this.apiUrl}`)
                .pipe(
                    map(respone => respone.data as Platform[]),
                    tap( data => this._platforms.set(data)),
                    catchError((error: HttpErrorResponse) => {
                        const apiError: ApiError = error.error || this.defaultError
                        return throwError(() => apiError);
                    })
                )
    }

    createPlatform(platform: PlatformRegister) : Observable<Platform> {
        return this.http.post<ApiResponse<Platform>>(this.apiUrl, platform)
                .pipe(
                    map(response => response.data as Platform),
                    tap( data => {
                        this._platforms.update(list => [...list, data])
                    }),
                    catchError((error: HttpErrorResponse) => {
                        const apiError = error.error || this.defaultError
                        return throwError(() => apiError);
                    })
                )
    }

    updatePlatform(id: string, platformUpdate: PlatformUpdate) : Observable<ApiResponse<Platform>> {
        return this.http.put<ApiResponse<Platform>>(`${this.apiUrl}/${id}`, platformUpdate)
                .pipe(
                    map(response => response as ApiResponse<Platform>),
                    tap(res => {
                        const data = res.data
                        this._platforms.update(oldList => oldList.map(p => p.id == id ? data : p))
                    }),
                    catchError((error: HttpErrorResponse) => {
                        const apiError = error.error || this.defaultError
                        return throwError(() => apiError);
                    })
                )
    }

    deletePlatform(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
            .pipe(
                tap(() => {
                    this._platforms.update(oldList => oldList.filter(p => p.id !== id));
                }),
                catchError((error: HttpErrorResponse) => {
                    const apiError = error.error || this.defaultError;
                    return throwError(() => apiError);
                })
            );
}
}
