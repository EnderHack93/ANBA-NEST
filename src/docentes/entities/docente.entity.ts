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
import { Estado } from 'src/estados/entites/estado.entity';

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

  @Column({
    default: 'https://res.cloudinary.com/dvxqmtrlf/image/upload/v1727586181/ztxvun4l6l2y0pfuqca0.png',
  })
  img_perfil:string
  

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

  @OneToOne(() => Usuario, (usuario) => usuario.docente,{eager:true})
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => Estado, (estado) => estado.nombre, {eager:true})
  @JoinColumn({ name: 'id_estado'})
  estado: Estado;
}
