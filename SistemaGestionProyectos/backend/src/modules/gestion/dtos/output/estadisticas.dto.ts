import { ApiProperty } from "@nestjs/swagger";

export class ProyectosPorClienteDTO {

    @ApiProperty()
    cliente!: string;

    @ApiProperty()
    cantidad!: number;

}

export class EstadisticasDTO {

    @ApiProperty()
    proyectosActivos!: number;

    @ApiProperty()
    proyectosFinalizados!: number;

    @ApiProperty()
    proyectosBaja!: number;

    @ApiProperty()
    totalProyectos!: number;

    @ApiProperty()
    tareasPendientes!: number;

    @ApiProperty()
    tareasFinalizadas!: number;

    @ApiProperty()
    tareasBaja!: number;

    @ApiProperty()
    totalTareas!: number;

    @ApiProperty()
    clientesActivos!: number;

    @ApiProperty()
    clientesBaja!: number;

    @ApiProperty()
    totalClientes!: number;

    @ApiProperty({ type: ProyectosPorClienteDTO, isArray: true })
    totalProyectosPorCliente!: ProyectosPorClienteDTO[];

}
