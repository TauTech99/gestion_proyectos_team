import { EstadosProyectosEnum } from "../estados-proyectos-enum";
import { CreateProyectoDTO } from "./create-proyecto-dto";

export interface UpdateProyectoDto extends Pick<CreateProyectoDTO, "nombre" | "idCliente" | "fechaFin"> {

    estado: EstadosProyectosEnum;

}
