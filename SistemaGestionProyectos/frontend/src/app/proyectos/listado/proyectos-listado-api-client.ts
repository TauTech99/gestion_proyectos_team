import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ListProyectoDTO} from "./list-proyecto-dto";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProyectosListadoApiClient {

    private readonly httpClient = inject(HttpClient);
    
    buscarProyectos(): Observable<ListProyectoDTO[]> {
        return this.httpClient.get<ListProyectoDTO[]>('/api/v1/proyectos');
    }

}