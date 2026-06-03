import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { UpdateClienteDto } from "./update-cliente-dto";
import { CreateClienteDTO } from "./create-cliente-dto";

@Injectable({
    providedIn: "root"
})
export class GestionClienteApiClient {

    private readonly httpClient: HttpClient = inject(HttpClient);

    crearCliente(cliente: CreateClienteDTO): Observable<{ id: number }> {
        return this.httpClient.post<{ id: number }>("/api/v1/clientes", cliente);
    }

    actualizarCliente(id: number, cliente: UpdateClienteDto): Observable<void> {
        return this.httpClient.put<void>("/api/v1/clientes/" + id, cliente);
    }
}