import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Docente } from 'src/docentes/entities/docente.entity';
import { Materia } from 'src/materias/entities/materia.entity';
import { Estado } from 'src/estados/entites/estado.entity';

@Entity()
class Especialidad {
  @PrimaryGeneratedColumn()
  id_especialidad: number;

  @Column({ unique: true })
  nombre: string;

  @Column({ default: 8 })
  duracion: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Estudiante, (estudiante) => estudiante.especialidad)
  estudiante: Estudiante[];

  @OneToMany(() => Docente, (docente) => docente.especialidad)
  docente: Docente[];

  @OneToMany(() => Materia, (materia) => materia.especialidad)
  materia: Materia[];

  @ManyToOne(() => Estado, (estado) => estado.nombre, {eager:true})
  @JoinColumn({ name: 'id_estado'})
  estado: Estado;
}

export { Especialidad };
