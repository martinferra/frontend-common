import { inject } from '@angular/core';
import { HttpEvent, HttpRequest, HttpErrorResponse, HttpHandlerFn } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export function getCatchErrorFn() {

  return (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
  ): Observable<HttpEvent<unknown>> => {

    const snackBar = inject(MatSnackBar);

    const showSnackBar = (response: HttpErrorResponse): Observable<never> => {
      
      const text: string | undefined =
        response.error?.message ?? response.error.statusText;
  
      if (text) {
        snackBar.open(text, 'Close', {
          duration: 2000,
        });
      }
      return throwError(() => response);
    };

    return next(req).pipe(catchError(showSnackBar));
  }
};