import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class LoginApiClient {

    private readonly client: HttpClient = inject(HttpClient);

    iniciarSesion(nombre: string, clave: string): Observable<{ accessToken: string }> {
        return this.client.post<{ accessToken: string }>("/api/v1/auth", { nombre, clave });
    }

}