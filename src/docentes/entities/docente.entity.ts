import { Especialidad } from 'src/especialidades/entities/especialidad.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { EstadoDocentes } from './estado.enum';
import { Clase } from 'src/clases/entities/clase.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Entity()
export class Docente {
  @Column({ primary: true })
  id_docente: string;

  @Column()
  nombres: string;

  @Column()
  apellidos: string;

  @Column({ unique: true })
  carnet: string;

  @Column({ nullable: true })
  fecha_nacimiento: Date;

  @Column({ nullable: true })
  telefono: string;

  @Column({ default: EstadoDocentes.ACTIVO })
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

  @OneToMany(() => Clase, (clase) => clase.id_clase)
  clases: Clase[];

  @OneToOne(() => Usuario, (usuario) => usuario.estudiante)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}
