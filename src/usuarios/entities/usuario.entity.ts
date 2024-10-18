import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';
import { Docente } from 'src/docentes/entities/docente.entity';
import { Estados } from 'src/estados/enum/estado.enum';
import { EnumRoles } from 'src/common/enums/roles.enum';
import { Estado } from 'src/estados/entites/estado.entity';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: EnumRoles, default: EnumRoles.ESTUDIANTE })
  rol: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Estudiante, (estudiante) => estudiante.usuario)
  estudiante: Estudiante;

  @OneToOne(() => Docente, (docente) => docente.usuario)
  docente: Docente;

  @ManyToOne(() => Estado, (estado) => estado.nombre, {eager:true})
  @JoinColumn({ name: 'id_estado'})
  estado: Estado;
}
