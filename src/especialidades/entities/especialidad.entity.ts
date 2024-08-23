import { Estudiante } from "src/estudiantes/entities/estudiante.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EstadoEsp } from "./estado.enum";

@Entity()
export class Especialidad {
  @PrimaryGeneratedColumn()
  id_especialidad: number;

  @Column({unique:true})
  nombre: string;

  @Column({default:EstadoEsp.ACTIVO})
  estado:EstadoEsp

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(()=>Estudiante,(estudiante)=>estudiante.especialidad)
  estudiante:Estudiante[]
}
