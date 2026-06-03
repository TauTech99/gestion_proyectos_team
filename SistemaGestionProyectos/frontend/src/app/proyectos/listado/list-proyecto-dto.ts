import { ListClienteDTO } from "../clientes/listado/list-cliente-dto";

export interface ListProyectoDTO{
    id: number;
    nombre: string;
    estado: string;
    cliente: ListClienteDTO;
    fechaFin: string | null;
}
