import { EstadosClientesEnum } from "../estados-cliente-enum";
import { CreateClienteDTO } from "./create-cliente-dto";

export interface UpdateClienteDto extends Pick<CreateClienteDTO, "nombre"> {
    estado: EstadosClientesEnum;
}