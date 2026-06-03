import { EstadosClientesEnum } from "../estados-clientes-enum";
import { CreateClienteDTO } from "./create-cliente-dto";

export interface UpdateClienteDto extends Pick<CreateClienteDTO, "nombre" | "telefono" | "email"> {

    estado: EstadosClientesEnum;

}
