import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { CreateTareaDTO } from "./create-tarea-dto";
import { UpdateTareaDto } from "./update-tarea-dto";

@Injectable({
    providedIn: "root"
})
export class GestionTareaApiClient {

    private readonly httpClient: HttpClient = inject(HttpClient);

    crearTarea(idProyecto: number | null, tarea: CreateTareaDTO): Observable<{ id: number }> {
        return this.httpClient.post<{ id: number }>("/api/v1/proyectos/" + idProyecto + "/tareas", tarea);
    }

    actualizarTarea(idProyecto: number | null, id: number, tarea: UpdateTareaDto): Observable<void> {
        return this.httpClient.put<void>("/api/v1/proyectos/" + idProyecto + "/tareas/" + id, tarea);
    }
}