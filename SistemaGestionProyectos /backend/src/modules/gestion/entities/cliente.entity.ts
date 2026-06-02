import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EstadosClientesEnum } from "../enums/estados-clientes.enum";
import { Proyecto } from "./proyecto.entity";

@Entity({ name: "clientes" })
export class Cliente {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @Column({ type: 'enum', enum: EstadosClientesEnum })
    estado!: EstadosClientesEnum

    @OneToMany(() => Proyecto, (proyecto) => proyecto.cliente)
    proyectos!: Proyecto[]

}