import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ListClienteDTO } from "./list-cliente-dto";
import { EstadosClientesEnum } from "../estados-clientes-enum";

@Injectable({
    providedIn: 'root'
})
export class ClientesListadoApiClient {

    private readonly httpClient = inject(HttpClient);

    buscarClientes(estado?: EstadosClientesEnum): Observable<ListClienteDTO[]> {

        let path: string = '/api/v1/clientes';

        if (estado) {
            path += "?estado=" + estado;
        }

        return this.httpClient.get<ListClienteDTO[]>(path);
    }

}