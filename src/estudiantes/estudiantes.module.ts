import { Module } from '@nestjs/common';
import { EstudiantesService } from './estudiantes.service';
import { EstudiantesController } from './estudiantes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from './entities/estudiante.entity';
import { Especialidad } from 'src/especialidades/entities/especialidad.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Inscrito } from 'src/inscritos/entities/inscrito.entity';
import { EstadoModule } from 'src/estados/estado.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { MateriasModule } from 'src/materias/materias.module';

@Module({
  imports:[TypeOrmModule.forFeature([Estudiante,Especialidad,Inscrito]),EstadoModule,UsuariosModule,MateriasModule],
  controllers: [EstudiantesController],
  providers: [EstudiantesService,CloudinaryService],
  exports: [EstudiantesService],
})
export class EstudiantesModule {}
