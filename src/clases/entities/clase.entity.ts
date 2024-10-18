import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { estado, horarios } from './clase.enum';
import { Docente } from 'src/docentes/entities/docente.entity';
import { Materia } from 'src/materias/entities/materia.entity';
import { Inscrito } from 'src/inscritos/entities/inscrito.entity';
import { Asistencia } from 'src/asistencia/entities/asistencia.entity';

@Entity()
export class Clase {
  @PrimaryGeneratedColumn()
  id_clase: number;

  @Column()
  nombre: string;

  @Column()
  capacidad_max: number;

  @Column()
  horario: horarios;

  @Column()
  aula: string;

  @Column({default:estado.ACTIVO})
  estado: estado;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Docente, (docente) => docente.id_docente, {
    eager: true,
  })
  @JoinColumn({ name: 'id_docente' })
  docente: Docente;

  @ManyToOne(()=> Materia, (materia) => materia.id_materia, {
    eager: true,
  })
  @JoinColumn({ name: 'id_materia' })
  materia: Materia;

  @OneToMany(() => Inscrito, inscritos => inscritos.clase)
  inscritos: Inscrito[];

  @OneToMany(() => Asistencia, asistencia => asistencia.clase)
  asistencias: Asistencia[];
  
}
