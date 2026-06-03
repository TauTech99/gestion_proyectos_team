import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { EstadosClientesEnum } from "../../enums/estados-clientes.enum";

export class ListClienteDTO {

    @ApiProperty()
    id!: number;

    @ApiProperty()
    nombre!: string;

    @ApiProperty()
    estado!: EstadosClientesEnum;

    @ApiPropertyOptional()
    telefono?: string;

    @ApiPropertyOptional()
    email?: string;

}