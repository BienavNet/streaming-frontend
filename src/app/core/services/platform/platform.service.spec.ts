import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { PlatformService } from './platform.service'; // Ajusta la ruta
import { Platform } from '../../models/platform.model';
import { ApiError } from '../../models/apiResponse';
import { environment } from '../../../../environments/environment.development';

describe('PlatformService', () => {
  let service: PlatformService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.api_base_url}/platform`;

  // Mocks de datos para los tests
  const mockPlatforms: Platform[] = [
    { id: '1', name: 'Angular', link: 'angular.dev', icon: 'angular-icon' },
    { id: '2', name: 'React', link: 'react.dev', icon: 'react-icon' }
  ];

  const mockApiError: ApiError = {
    code: 404,
    message: 'Platform with that ID not found.',
    timestamp: '2026-06-08T10:46:42.2059976'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PlatformService]
    });

    service = TestBed.inject(PlatformService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Garantiza que no queden peticiones HTTP pendientes entre cada test
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // --- TESTS PARA LOAD PLATFORMS ---
  describe('loadPlatforms', () => {
    it('should load platforms and update the signal on success', () => {
      service.loadPlatforms().subscribe((data) => {
        expect(data).toEqual(mockPlatforms);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockPlatforms); // Simula respuesta exitosa

      // Verificar que el Readonly Signal se actualizó correctamente
      expect(service.platforms()).toEqual(mockPlatforms);
    });

    it('should return ApiError when the server fails', () => {
      service.loadPlatforms().subscribe({
        next: () => fail('expected an error, not platforms'),
        error: (error: ApiError) => {
          expect(error.code).toBe(404);
          expect(error.message).toBe('Platform with that ID not found.');
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(mockApiError, { status: 404, statusText: 'Not Found' });
    });
  });

  // --- TESTS PARA CREATE PLATFORM ---
  describe('createPlatform', () => {
    it('should append a new platform to the signal list', () => {
      const newPlatform: Platform = { id: '3', name: 'Vue', link: 'vuejs.org', icon: 'vue-icon' };

      service.createPlatform(newPlatform).subscribe((data) => {
        expect(data).toEqual(newPlatform);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      req.flush(newPlatform);

      // Comprobar que el Signal ahora contiene el elemento nuevo
      expect(service.platforms()).toContain(newPlatform);
      expect(service.platforms().length).toBe(1);
    });
  });

  // --- TESTS PARA UPDATE PLATFORM ---
  describe('updatePlatform', () => {
    it('should update an existing platform in the signal list', () => {
      // Estado inicial simulado en el Signal
      // Forzamos un estado inicial usando el signal interno de desarrollo si es necesario, 
      // o cargándolo previamente de manera limpia:
      service.loadPlatforms().subscribe();
      httpMock.expectOne(apiUrl).flush(mockPlatforms);

      const updatedPlatform: Platform = { id: '1', name: 'Angular v19', link: 'angular.dev', icon: 'angular-new-icon' };


      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(updatedPlatform);

      // Verificar que el ID 1 se reemplazó en el Signal
      const updatedInSignal = service.platforms().find(p => p.id === '1');
      expect(updatedInSignal?.name).toBe('Angular v19');
    });
  });

  // --- TESTS PARA DELETE PLATFORM ---
  describe('deletePlatform', () => {
    it('should remove the platform from the signal list', () => {
      // Estado inicial en el Signal (Cargamos las 2 plataformas mockeadas)
      service.loadPlatforms().subscribe();
      httpMock.expectOne(apiUrl).flush(mockPlatforms);

      service.deletePlatform('1').subscribe();

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockPlatforms[0]); // Tu API retorna la plataforma eliminada

      // Verificar que el Signal ya no contiene el ID 1 y le queda 1 elemento
      expect(service.platforms().length).toBe(1);
      expect(service.platforms().some(p => p.id === '1')).toBeFalsy();
    });
  });
});

function fail(arg0: string): void {
  throw new Error('Function not implemented.');
}
