import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";
import { AuthStore } from "./auth-store";

export function authInterceptor( req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>>{
    const authToken = inject(AuthStore).obtenerToken();

    if (!authToken) {
        return next(req);
    }

    const reqWithToken = req.clone({
        headers: req.headers.set('Authorization',`Bearer ${authToken}`)
    });

    return next(reqWithToken);
}