import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { EstadosUsuariosEnum } from "../enums/estados.usuarios.enum";


@Entity({name: "usuarios"})
export class Usuario{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string

    @Column()
    clave!: string

    @Column({type: 'enum', enum: EstadosUsuariosEnum})
    estado!: EstadosUsuariosEnum

}