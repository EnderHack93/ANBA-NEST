import { Estado } from "src/estados/entites/estado.entity";
import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Entity, Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn, JoinColumn, OneToOne, ManyToOne } from "typeorm";

@Entity('administrador')
export class Administrador {
    @Column({primary:true})
    id_admin: string;
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

  @OneToOne(() => Usuario, (usuario) => usuario.estudiante)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => Estado, (estado) => estado.nombre, {eager:true})
  @JoinColumn({ name: 'id_estado'})
  estado: Estado;


}
