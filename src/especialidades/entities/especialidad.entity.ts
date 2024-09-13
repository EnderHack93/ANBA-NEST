import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EstadoEspecialidad } from './estado.enum';
import { Docente } from 'src/docentes/entities/docente.entity';
import { Materia } from 'src/materias/entities/materia.entity';

@Entity()
class Especialidad {
  @PrimaryGeneratedColumn()
  id_especialidad: number;

  @Column({ unique: true })
  nombre: string;

  @Column({default:8})
  duracion: number;

  @Column({ default: EstadoEspecialidad.ACTIVO })
  estado: EstadoEspecialidad;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Estudiante, (estudiante) => estudiante.especialidad)
  estudiante: Estudiante[];

  @OneToMany(() => Docente, (docente) => docente.especialidad)
  docente: Docente[];

  @OneToMany(()=> Materia, (materia) => materia.especialidad)
  materia: Materia[];
}

export { Especialidad };
