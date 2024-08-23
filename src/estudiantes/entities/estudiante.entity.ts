import { Especialidad } from 'src/especialidades/entities/especialidad.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { EstadoEst } from './estado.enum';

@Entity()
export class Estudiante {
  @Column({ primary: true })
  id_estudiante: string;

  @Column()
  nombres: string;

  @Column()
  apellidos: string;

  @Column()
  fecha_nacimiento: Date;

  @Column({unique:true})
  correo: string;

  @Column({unique:true})
  carnet: string;

  @Column({ nullable: true })
  telefono: string;

  @Column()
  password: string;

  @Column({ default:EstadoEst.ACTIVO})
  estado: EstadoEst;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(()=> Especialidad,(especialidad)=> especialidad.id_especialidad,{
    eager:true,
  })
  @JoinColumn({name:'id_especialidad'})
  especialidad:Especialidad
}
