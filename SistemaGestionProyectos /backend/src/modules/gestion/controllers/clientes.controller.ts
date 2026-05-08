import {  ParseIntPipe, Body, Controller, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CreateClienteDto } from "../dtos/input/create-cliente.dto";
import { ApiBearerAuth, ApiOkResponse, ApiQuery } from "@nestjs/swagger";
import { ListClienteDTO } from "../dtos/output/list-cliente.dto";
import { UpdateClienteDto } from "../dtos/input/update-cliente.dto";
import { EstadosClientesEnum } from "../enums/estados-clientes.enum";
import { ClientesService } from "../services/clientes.service";
import { AuthGuard } from "../../auth/guards/auth.guard";

@Controller('clientes')
export class ClientesController {

    constructor(private readonly clientesService: ClientesService) { }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Post()
    async crearCliente(@Body() dto: CreateClienteDto): Promise<{ id: number }> {
        return await this.clientesService.crearCliente(dto);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Put(":id")
    async actualizarCliente(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateClienteDto): Promise<void> {
        await this.clientesService.actualizarCliente(id, dto);
    }

    @ApiBearerAuth()
    @ApiOkResponse({ type: ListClienteDTO, isArray: true })
    @ApiQuery({
        name: 'estado',
        required: false,
        enum: EstadosClientesEnum
    })
    @UseGuards(AuthGuard)
    @Get()
    async obtenerClientes(@Query("estado") estado: EstadosClientesEnum): Promise<ListClienteDTO[]> {
        return await this.clientesService.obtenerClientes(estado);
    }

}