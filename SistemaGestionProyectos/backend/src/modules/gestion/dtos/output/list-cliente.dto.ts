import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { EstadosClientesEnum } from "../../enums/estados-clientes.enum";

export class ListClienteDTO {

    @ApiProperty()
    id!: number;

    @ApiProperty()
    nombre!: string;

    @ApiPropertyOptional()
    email?: string;

    @ApiPropertyOptional()
    telefono?: string;

    @ApiProperty()
    estado!: EstadosClientesEnum;
}