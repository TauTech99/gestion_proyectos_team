import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateClienteDto {

    @ApiProperty({ description: 'Nombre completo o Razón Social del cliente' })
    @IsString()
    @IsNotEmpty()
    nombre!: string;

    @ApiProperty({ description: 'CUIT o DNI único del cliente' })
    @IsString()
    @IsNotEmpty()
    cuit!: string;

    @ApiProperty({ description: 'Correo electrónico de contacto' })
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @ApiProperty({ description: 'Teléfono de contacto (Opcional)', required: false })
    @IsString()
    @IsOptional()
    telefono!: string;

}