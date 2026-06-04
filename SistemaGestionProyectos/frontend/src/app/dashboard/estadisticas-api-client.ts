import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { EstadisticasDTO } from "./estadisticas-dto";

@Injectable({
    providedIn: 'root'
})
export class EstadisticasApiClient {

    private readonly httpClient = inject(HttpClient);

    obtenerEstadisticas(): Observable<EstadisticasDTO> {
        return this.httpClient.get<EstadisticasDTO>('/api/v1/estadisticas');
    }

}
