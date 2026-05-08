import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateTareaDto } from "../dtos/input/create-tarea.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Tarea } from "../entities/tarea.entity";
import { Repository } from "typeorm";
import { EstadosTareasEnum } from "../enums/estados-tareas.enum";
import { UpdateTareaDto } from "../dtos/input/update-tarea.dto";

@Injectable()
export class TareasService {

    constructor(@InjectRepository(Tarea) private readonly tareasRepository: Repository<Tarea>) {

    }

    async crearTarea(dto: CreateTareaDto, idProyecto: number): Promise<{ id: number }> {

        const tarea: Tarea = this.tareasRepository.create(dto);

        tarea.estado = EstadosTareasEnum.PENDIENTE;
        tarea.idProyecto = idProyecto;

        await this.tareasRepository.save(tarea);

        return { id: tarea.id };

    }

    async actualizarTarea(dto: UpdateTareaDto, idTarea: number): Promise<void> {
        const tarea: Tarea | null = await this.tareasRepository.findOne({ where: { id: idTarea } });

        if (!tarea) {
            throw new BadRequestException("Tarea solicitada no encontrada");
        }

        this.tareasRepository.merge(tarea, dto);

        await this.tareasRepository.save(tarea);

    }

}