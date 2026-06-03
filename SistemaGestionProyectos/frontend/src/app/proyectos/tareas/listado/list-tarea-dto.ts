import { EstadosTareasEnum } from "../estados-tareas-enum";

export interface ListTareaDTO{
    id: number;
    descripcion: string;
    estado: EstadosTareasEnum;
}