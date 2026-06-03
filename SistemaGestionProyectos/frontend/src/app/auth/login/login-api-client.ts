import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({providedIn: 'root'})

export class LoginApiClient{

    private readonly client: HttpClient = inject(HttpClient);

    login(nombre: string, clave: string): Observable<{accessToken: string}> {
        return this.client.post<{accessToken: string}>("/api/v1/auth", {nombre, clave});
    }
}