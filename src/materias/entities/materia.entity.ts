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
import { Estado } from 'src/estados/entites/estado.entity';
import { Semestre } from 'src/semestre/entities/semestre.entity';

@Entity()
export class Materia {
  @PrimaryGeneratedColumn()
  id_materia: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

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

  @OneToMany(() => Clase, (clase) => clase.materia)
  clases: Clase[];

  @ManyToOne(()=> Semestre, (semestre) => semestre.materias,)
  @JoinColumn({ name: 'id_semestre' })
  semestre: Semestre;

  @ManyToOne(() => Estado, (estado) => estado.nombre, {eager:true})
  @JoinColumn({ name: 'id_estado'})
  estado: Estado;
}
