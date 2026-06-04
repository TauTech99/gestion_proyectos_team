import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { AuthStore } from "./auth-store";

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {

  const authStore = inject(AuthStore);
  const authToken = authStore.obtenerToken();

  if (!authToken) {
    return next(req);
  }

  const reqWithToken = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${authToken}`)
  });

  return next(reqWithToken).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authStore.cerrarSesion();
      }
      return throwError(() => error);
    })
  );
}