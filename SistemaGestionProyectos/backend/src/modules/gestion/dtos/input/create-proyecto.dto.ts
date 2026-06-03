import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProyectoDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nombre!: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    idCliente!: number;

    @ApiPropertyOptional({ example: "2026-12-31" })
    @IsOptional()
    @IsDateString()
    fechaFin?: string;

}