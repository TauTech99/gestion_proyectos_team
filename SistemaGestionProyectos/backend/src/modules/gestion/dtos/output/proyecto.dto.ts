import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { EstadosProyectosEnum } from "../../enums/estados-proyectos.enum";
import { ListTareaDTO } from "./list-tarea.dto";

export class ProyectoDTO {

    @ApiProperty()
    nombre!: string;

    @ApiProperty()
    estado!: EstadosProyectosEnum;

    @ApiProperty()
    cliente!: string;

    @ApiPropertyOptional()
    fechaFin?: string;

    @ApiProperty()
    tareas!: ListTareaDTO[];

}