import { Especialidad } from 'src/especialidades/entities/especialidad.entity';
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
import { EstadoMateria } from './estado.enum';
import { Clase } from 'src/clases/entities/clase.entity';

@Entity()
export class Materia {
  @PrimaryGeneratedColumn()
  id_materia: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  semestre: string;

  @Column({
    default: EstadoMateria.ACTIVO,
  })
  estado: EstadoMateria;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(
    () => Especialidad,
    (especialidad) => especialidad.id_especialidad,
    {
      eager: true,
    },
  )
  @JoinColumn({ name: 'id_especialidad' })
  especialidad: Especialidad;

  @OneToMany(() => Clase, (clase) => clase.id_clase)
  clases: Clase[];
}
