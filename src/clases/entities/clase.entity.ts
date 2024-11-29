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
import { Docente } from 'src/docentes/entities/docente.entity';
import { Materia } from 'src/materias/entities/materia.entity';
import { Inscrito } from 'src/inscritos/entities/inscrito.entity';
import { Asistencia } from 'src/asistencia/entities/asistencia.entity';
import { Evaluacion } from 'src/evaluaciones/entities/evaluacion.entity';
import { Estado } from 'src/estados/entites/estado.entity';
import { EnumHorarios } from 'src/common/enums/horarios.enum';


@Entity()
export class Clase {
  @PrimaryGeneratedColumn()
  id_clase: number;

  @Column()
  nombre: string;

  @Column()
  capacidad_max: number;

  @Column({type: 'enum', enum:EnumHorarios})
  horario: EnumHorarios;

  @Column()
  horaInicio:String;

  @Column()
  horaFin:String;

  @Column()
  aula: string;

  @Column('text', { array: true , nullable: true}) // Define el campo como un arreglo de texto
  dias: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Docente, (docente) => docente.id_docente, {
    eager: true,
  })
  @JoinColumn({ name: 'id_docente' })
  docente: Docente;

  @ManyToOne(()=> Materia, (materia) => materia.clases, {
    eager: true,
  })
  @JoinColumn({ name: 'id_materia' })
  materia: Materia;

  @OneToMany(() => Inscrito, inscritos => inscritos.clase)
  inscritos: Inscrito[];

  @OneToMany(() => Asistencia, asistencia => asistencia.clase)
  asistencias: Asistencia[];

  @OneToMany(() => Evaluacion, evaluacion => evaluacion.clase)
  evaluaciones: Evaluacion[];

  @ManyToOne(() => Estado, (estado) => estado.nombre, {eager:true})
  @JoinColumn({ name: 'id_estado'})
  estado: Estado;
  
}
