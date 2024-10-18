import { Clase } from "src/clases/entities/clase.entity";
import { Estudiante } from "src/estudiantes/entities/estudiante.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EnumAsistencia } from "../enums/asistencia.enum";

@Entity('asistencia')
export class Asistencia {
    @PrimaryGeneratedColumn()
    id_asistencia: number;

    @ManyToOne(()=> Clase, (clase) => clase.asistencias, {onDelete:"CASCADE"})
    @JoinColumn({name:"id_clase"})
    clase:Clase

    @ManyToOne(()=> Estudiante, (estudiante) => estudiante.asistencias, {onDelete:"CASCADE"})
    @JoinColumn({name:"id_estudiante"})
    estudiante:Estudiante

    @Column({type:Date})
    fecha:Date

    @Column({type:"enum",enum:EnumAsistencia, default:EnumAsistencia.FALTO})
    asistio: EnumAsistencia

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}
