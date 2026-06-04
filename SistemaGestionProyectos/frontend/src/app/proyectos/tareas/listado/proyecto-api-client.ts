import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ProyectoDTO } from "./proyecto-dto";

@Injectable({
    providedIn: 'root'
})
export class ProyectoApiClient {

    private readonly httpClient = inject(HttpClient);

    buscarProyecto(id: number | null): Observable<ProyectoDTO> {
        return this.httpClient.get<ProyectoDTO>(`/api/v1/proyectos/${id}`);
    }

}