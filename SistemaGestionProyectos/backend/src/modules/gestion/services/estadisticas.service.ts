import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cliente } from "../entities/cliente.entity";
import { Proyecto } from "../entities/proyecto.entity";
import { Tarea } from "../entities/tarea.entity";
import { EstadosClientesEnum } from "../enums/estados-clientes.enum";
import { EstadosProyectosEnum } from "../enums/estados-proyectos.enum";
import { EstadosTareasEnum } from "../enums/estados-tareas.enum";
import { EstadisticasDTO, ProyectosPorClienteDTO } from "../dtos/output/estadisticas.dto";

@Injectable()
export class EstadisticasService {

    constructor(
        @InjectRepository(Cliente) private readonly clientesRepository: Repository<Cliente>,
        @InjectRepository(Proyecto) private readonly proyectosRepository: Repository<Proyecto>,
        @InjectRepository(Tarea) private readonly tareasRepository: Repository<Tarea>,
    ) { }

    async obtenerEstadisticas(): Promise<EstadisticasDTO> {

        const proyectosActivos: number = await this.proyectosRepository.count({ where: { estado: EstadosProyectosEnum.ACTIVO } });
        const proyectosFinalizados: number = await this.proyectosRepository.count({ where: { estado: EstadosProyectosEnum.FINALIZADO } });
        const proyectosBaja: number = await this.proyectosRepository.count({ where: { estado: EstadosProyectosEnum.BAJA } });

        const tareasPendientes: number = await this.tareasRepository.count({ where: { estado: EstadosTareasEnum.PENDIENTE } });
        const tareasFinalizadas: number = await this.tareasRepository.count({ where: { estado: EstadosTareasEnum.FINALIZADA } });
        const tareasBaja: number = await this.tareasRepository.count({ where: { estado: EstadosTareasEnum.BAJA } });

        const clientesActivos: number = await this.clientesRepository.count({ where: { estado: EstadosClientesEnum.ACTIVO } });
        const clientesBaja: number = await this.clientesRepository.count({ where: { estado: EstadosClientesEnum.BAJA } });

        const proyectosPorCliente = await this.proyectosRepository
            .createQueryBuilder('proyecto')
            .innerJoin('proyecto.cliente', 'cliente')
            .select('cliente.nombre', 'cliente')
            .addSelect('COUNT(proyecto.id)', 'cantidad')
            .groupBy('cliente.nombre')
            .orderBy('cantidad', 'DESC')
            .getRawMany<{ cliente: string; cantidad: string }>();

        const totalProyectosPorCliente: ProyectosPorClienteDTO[] = proyectosPorCliente.map(p => {
            const item = new ProyectosPorClienteDTO();
            item.cliente = p.cliente;
            item.cantidad = parseInt(p.cantidad, 10);
            return item;
        });

        const dto = new EstadisticasDTO();
        dto.proyectosActivos = proyectosActivos;
        dto.proyectosFinalizados = proyectosFinalizados;
        dto.proyectosBaja = proyectosBaja;
        dto.totalProyectos = proyectosActivos + proyectosFinalizados + proyectosBaja;

        dto.tareasPendientes = tareasPendientes;
        dto.tareasFinalizadas = tareasFinalizadas;
        dto.tareasBaja = tareasBaja;
        dto.totalTareas = tareasPendientes + tareasFinalizadas + tareasBaja;

        dto.clientesActivos = clientesActivos;
        dto.clientesBaja = clientesBaja;
        dto.totalClientes = clientesActivos + clientesBaja;

        dto.totalProyectosPorCliente = totalProyectosPorCliente;

        return dto;
    }

}
