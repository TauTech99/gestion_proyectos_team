import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { CreateProyectoDTO } from "./create-proyecto-dto";
import { UpdateProyectoDto } from "./update-proyecto-dto";

@Injectable({
    providedIn: "root"
})
export class GestionProyectoApiClient {

    private readonly httpClient: HttpClient = inject(HttpClient);

    crearProyecto(proyecto: CreateProyectoDTO): Observable<{id: number}> {
        return this.httpClient.post<{id: number}>("/api/v1/proyectos", proyecto);
    }

    actualizarProyecto(id: number, proyecto: UpdateProyectoDto): Observable<void> {
        return this.httpClient.put<void>("/api/v1/proyectos/" +  id, proyecto);
    }
}