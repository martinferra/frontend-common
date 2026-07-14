import { inject } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/services';

export function getAuthHeaderFn() {

  return (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
  ): Observable<HttpEvent<unknown>> => {

    const authService = inject(AuthService);

    req = req.clone({
      setHeaders: authService.getAuthorizationHeaders(),
    });
    
    return next(req);
  }
};
