import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CreateProyectoDTO } from "./create-proyecto-dto";
import { UpdateProyectoDTO } from "./update-proyecto-dto";
import { ListClienteDTO } from "../clientes/listado/list-cliente-dto";

@Injectable({
    providedIn: 'root'
})
export class GestionProyectoApiClient {

    private readonly httpClient = inject(HttpClient);

    crearProyecto(dto: CreateProyectoDTO): Observable<{ id: number }> {
        return this.httpClient.post<{ id: number }>('/api/v1/proyectos', dto);
    }

    actualizarProyecto(id: number, dto: UpdateProyectoDTO): Observable<void> {
        return this.httpClient.put<void>(`/api/v1/proyectos/${id}`, dto);
    }

    obtenerClientesActivos(): Observable<ListClienteDTO[]> {
        return this.httpClient.get<ListClienteDTO[]>('/api/v1/clientes?estado=ACTIVO');
    }

}