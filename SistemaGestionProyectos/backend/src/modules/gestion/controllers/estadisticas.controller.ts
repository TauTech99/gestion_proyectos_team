import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { EstadisticasService } from "../services/estadisticas.service";
import { EstadisticasDTO } from "../dtos/output/estadisticas.dto";

@Controller('estadisticas')
export class EstadisticasController {

    constructor(private readonly estadisticasService: EstadisticasService) { }

    @ApiBearerAuth()
    @ApiOkResponse({ type: EstadisticasDTO })
    @UseGuards(AuthGuard)
    @Get()
    async obtenerEstadisticas(): Promise<EstadisticasDTO> {
        return await this.estadisticasService.obtenerEstadisticas();
    }

}
