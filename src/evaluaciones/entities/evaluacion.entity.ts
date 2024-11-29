import { Clase } from "src/clases/entities/clase.entity";
import { EnumEstados } from "src/common/enums/estados.enum";
import { EnumTiposEvaluacion } from "src/common/enums/tipos-evaluaciones";
import { Estado } from "src/estados/entites/estado.entity";
import { Estudiante } from "src/estudiantes/entities/estudiante.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("evaluaciones")
export class Evaluacion {
    @PrimaryGeneratedColumn()
    id_evaluacion: number;

    @Column('float')
    nota: number;

    @Column({type:"enum",enum:EnumTiposEvaluacion, default:EnumTiposEvaluacion.PARCIAL1})
    tipo_evaluacion: EnumTiposEvaluacion;
    
    @CreateDateColumn()
    created_at: Date;
    
    @UpdateDateColumn()
    updated_at: Date;
    
    @ManyToOne(() => Estudiante, (estudiante) => estudiante.evaluacion)
    @JoinColumn({ name: 'id_estudiante' })
    estudiante: Estudiante;

    @ManyToOne(() => Clase, (clase) => clase.evaluaciones)
    @JoinColumn({ name: 'id_clase' })
    clase: Clase;

    @ManyToOne(() => Estado, (estado) => estado.nombre, {eager:true})
    @JoinColumn({ name: 'id_estado'})
    estado: Estado;
}
