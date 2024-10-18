import { IsDate } from 'class-validator';
import { Estado } from 'src/estados/entites/estado.entity';
import { Materia } from 'src/materias/entities/materia.entity';
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

@Entity('semestre')
export class Semestre {
  @PrimaryGeneratedColumn()
  id_semestre: number;

  @Column()
  nombre: string;

  @Column()
  gestion: string;

  @Column({type:Date})
  fecha_inicio: Date;

  @Column({type:Date})
  fecha_fin: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Materia, (materia) => materia.semestre)
  materias: Materia[];

  @ManyToOne(() => Estado, (estado) => estado.nombre, { eager: true })
  @JoinColumn({ name: 'id_estado' })
  estado: Estado;
}
