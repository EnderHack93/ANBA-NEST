import { Clase } from "src/clases/entities/clase.entity";
import { Estudiante } from "src/estudiantes/entities/estudiante.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { estadoInscritos } from "./inscrito.enum";

@Entity()
export class Inscrito {
  @PrimaryGeneratedColumn()
  id_inscrito: number;

  @ManyToOne(()=> Estudiante,estudiante => estudiante.inscritos)
  @JoinColumn({name:'id_estudiante'})
  estudiante: Estudiante;

  @ManyToOne(()=> Clase,clase => clase.inscritos)
  @JoinColumn({name:'id_clase'})
  clase: Clase;

  @Column({type:Date})
  fecha_inscripcion: Date;

  @Column()
  estado: estadoInscritos;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
