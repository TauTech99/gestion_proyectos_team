import { InjectRepository } from "@nestjs/typeorm";
import { Cliente } from "../entities/cliente.entity";
import { CreateClienteDto } from "../dtos/input/create-cliente.dto";
import { EstadosClientesEnum } from "../enums/estados-clientes.enum";
import { UpdateClienteDto } from "../dtos/input/update-cliente.dto";
import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { FindOptionsWhere, Repository } from "typeorm";
import { ListClienteDTO } from "../dtos/output/list-cliente.dto";
import { BadRequestException, forwardRef, Inject } from "@nestjs/common";
import { ProyectosService } from "./proyectos.service";

@Injectable()
export class ClientesService {

    constructor(
        @InjectRepository(Cliente) private readonly repository: Repository<Cliente>,
        @Inject(forwardRef(() => ProyectosService)) private readonly proyectosService: ProyectosService
    ) { }

    async crearCliente(dto: CreateClienteDto): Promise<{ id: number }> {

        const cliente: Cliente = this.repository.create(dto);
        cliente.estado = EstadosClientesEnum.ACTIVO;
        await this.repository.save(cliente);

        await this.registrarHistorial(
            cliente.id,
            'INSERT'
        );

        return { id: cliente.id };
    }

    async actualizarCliente(id: number, dto: UpdateClienteDto): Promise<void> {
        const cliente: Cliente | null = await this.repository.findOneBy({ id });

        if (!cliente) {
            throw new BadRequestException('Cliente no encontrado');
        }

        const relacionadoConProyectos: boolean = await this.proyectosService.existeProyectoPorIdCliente(id);

        if (relacionadoConProyectos && dto.estado === EstadosClientesEnum.BAJA) {
            throw new BadRequestException('No se puede dar de baja un cliente con proyectos relacionados');
        }

        console.log("DEBUG: Datos recibidos para actualizar:", dto);

        this.repository.merge(cliente, dto);
        await this.repository.save(cliente);

        await this.registrarHistorial(
            id,
            'UPDATE'
        );
    }

    async obtenerClientes(estado: EstadosClientesEnum): Promise<ListClienteDTO[]> {
        const whereCondition: FindOptionsWhere<ListClienteDTO> = {}

        if (estado){
            whereCondition.estado = estado
        }

        const clientes: Cliente[] = await this.repository.find({ select: { id: true, nombre: true, estado: true, telefono: true, email: true }, order: { id: 'ASC' }, where: whereCondition });

        const dtoList: ListClienteDTO[] = [];

        for (const c of clientes) {
            const dto = new ListClienteDTO();
            dto.id = c.id;
            dto.nombre = c.nombre;
            dto.estado = c.estado;
            dto.telefono = c.telefono;
            dto.email = c.email;
            dtoList.push(dto);
        }

        return dtoList;
    }

    async existeClienteActivoPorId(id: number): Promise<boolean> {
        const existe: boolean = await this.repository.exists({ where: { id, estado: EstadosClientesEnum.ACTIVO } });
        return existe;
    }

    private async registrarHistorial(
        idRegistro: number,
        accion: string
    ): Promise<void> {
        await this.repository.query(
            `INSERT INTO historial_cambios
            (entidad, id_registro, accion, usuario_nombre)
            VALUES ($1, $2, $3, $4)`,
            ['Cliente', idRegistro, accion, 'Sistema']
        );
    }

}