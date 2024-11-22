import { Especialidad } from 'src/especialidades/entities/especialidad.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EstadoEst } from './estado.enum';
import { Clase } from 'src/clases/entities/clase.entity';
import { Inscrito } from 'src/inscritos/entities/inscrito.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Asistencia } from 'src/asistencia/entities/asistencia.entity';
import { Estado } from 'src/estados/entites/estado.entity';
import { Evaluacion } from 'src/evaluaciones/entities/evaluacion.entity';

@Entity()
export class Estudiante {
  @Column({primary:true})
  id_estudiante: string;

  @Column()
  nombres: string;

  @Column()
  apellidos: string;
  
  @Column({unique:true})
  carnet: string;

  @Column()
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

  @ManyToOne(()=> Especialidad,(especialidad)=> especialidad.id_especialidad,{
    eager:true,
  })
  @JoinColumn({name:'id_especialidad'})
  especialidad:Especialidad

  @OneToMany(() => Inscrito, inscritos => inscritos.estudiante)
  inscritos: Inscrito[]

  @OneToMany(() => Asistencia, asistencia => asistencia.estudiante)
  asistencias: Asistencia[]

  @OneToOne(() => Usuario, (usuario) => usuario.estudiante)
  usuario: Usuario;

  @ManyToOne(() => Estado, (estado) => estado.nombre, {eager:true})
  @JoinColumn({ name: 'id_estado'})
  estado: Estado;

  @OneToMany(() => Evaluacion, (evaluacion) => evaluacion.estudiante)
  evaluacion: Evaluacion[];
  
}
