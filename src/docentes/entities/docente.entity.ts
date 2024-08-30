import { Especialidad } from 'src/especialidades/entities/especialidad.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { EstadoDocentes } from './estado.enum';

@Entity()
export class Docente {
  @Column({ primary: true })
  id_docente: string;

  @Column()
  nombres: string;

  @Column()
  apellidos: string;

  @Column({ unique: true })
  correo: string;

  @Column()
  password: string;

  @Column({ unique: true })
  carnet: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({default:EstadoDocentes.ACTIVO})
  estado: EstadoDocentes;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(
    () => Especialidad,
    (especialidad) => especialidad.id_especialidad,
    {
      eager: true,
    },
  )
  @JoinColumn({ name: 'id_especialidad' })
  especialidad: Especialidad;
}
