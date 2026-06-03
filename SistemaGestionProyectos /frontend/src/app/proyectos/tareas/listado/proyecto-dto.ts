import { ListTareaDTO } from "./list-tarea-dto";

export interface ProyectoDTO {
    nombre: string;
    estado: string;
    cliente?: string;
    tareas: ListTareaDTO[];
}