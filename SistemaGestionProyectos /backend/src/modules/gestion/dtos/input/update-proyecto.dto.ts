import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateProyectoDto } from "./create-proyecto.dto";
import { IsEnum, IsOptional } from "class-validator";
import { EstadosProyectosEnum } from "../../enums/estados-proyectos.enum";

export class UpdateProyectoDto extends PartialType(CreateProyectoDto) {

    @ApiProperty({
        enum: EstadosProyectosEnum,
        example: EstadosProyectosEnum.ACTIVO
    })
    @IsEnum(EstadosProyectosEnum)
    @IsOptional()
    estado?: EstadosProyectosEnum;

}