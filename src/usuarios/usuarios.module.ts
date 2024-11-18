import { forwardRef, Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Estado } from 'src/estados/entites/estado.entity';
import { EstadoModule } from 'src/estados/estado.module';
import { Docente } from 'src/docentes/entities/docente.entity';
import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';
import { DocentesModule } from 'src/docentes/docentes.module';
import { AdministradoresModule } from 'src/administradores/administradores.module';
import { EstudiantesModule } from 'src/estudiantes/estudiantes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Estado, Docente, Estudiante]),
    EstadoModule,

    forwardRef(()=>DocentesModule),
    forwardRef(()=>AdministradoresModule),
    forwardRef(()=>EstudiantesModule)
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
