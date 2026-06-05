import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EstadosClientesEnum } from "../enums/estados-clientes.enum";
import { Proyecto } from "./proyecto.entity";

@Entity({ name: "clientes" })
export class Cliente {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @Column({ nullable: true })
    email?: string;

    @Column({ nullable: true })
    telefono?: string;

    @Column({
        type: 'enum',
        enum: EstadosClientesEnum,
        default: EstadosClientesEnum.ACTIVO
    })
    estado!: EstadosClientesEnum;

    @OneToMany(() => Proyecto, (proyecto) => proyecto.cliente)
    proyectos!: Proyecto[];

}