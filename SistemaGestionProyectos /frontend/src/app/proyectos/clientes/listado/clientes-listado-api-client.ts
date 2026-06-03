import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ListClienteDTO } from "./list-cliente-dto";
import { HttpClient } from "@angular/common/http";
import { EstadosClientesEnum } from "../estados-clientes-enum";

@Injectable({
    providedIn: 'root'
})
export class ClientesListadoApiClient {

    private readonly httpClient = inject(HttpClient);

    buscarClientes(estado?: EstadosClientesEnum): Observable<ListClienteDTO[]> {
        let url = '/api/v1/clientes';
        if (estado) {
            url += `?estado=${estado}`;
        }
        return this.httpClient.get<ListClienteDTO[]>(url);
    }

}