import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CreateTareaDTO } from "./create-tarea-dto";
import { UpdateTareaDTO } from "./update-tarea-dto";

@Injectable({
    providedIn: 'root'
})
export class GestionTareaApiClient {

    private readonly httpClient = inject(HttpClient);

    crearTarea(idProyecto: number, dto: CreateTareaDTO): Observable<{ id: number }> {
        return this.httpClient.post<{ id: number }>(`/api/v1/proyectos/${idProyecto}/tareas`, dto);
    }

    actualizarTarea(idProyecto: number, idTarea: number, dto: UpdateTareaDTO): Observable<void> {
        return this.httpClient.put<void>(`/api/v1/proyectos/${idProyecto}/tareas/${idTarea}`, dto);
    }

}