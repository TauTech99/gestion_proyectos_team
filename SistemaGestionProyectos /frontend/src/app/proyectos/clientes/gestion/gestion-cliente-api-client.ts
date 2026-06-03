import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CreateClienteDTO } from "./create-cliente-dto";
import { UpdateClienteDto } from "./update-cliente-dto";

@Injectable({
    providedIn: 'root'
})
export class GestionClienteApiClient {

    private readonly httpClient = inject(HttpClient);

    crearCliente(dto: CreateClienteDTO): Observable<{ id: number }> {
        return this.httpClient.post<{ id: number }>('/api/v1/clientes', dto);
    }

    actualizarCliente(id: number, dto: UpdateClienteDto): Observable<void> {
        return this.httpClient.put<void>(`/api/v1/clientes/${id}`, dto);
    }

}