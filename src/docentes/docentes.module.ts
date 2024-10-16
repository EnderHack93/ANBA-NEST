import { Module } from '@nestjs/common';
import { DocentesService } from './docentes.service';
import { DocentesController } from './docentes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Docente } from './entities/docente.entity';
import { Especialidad } from 'src/especialidades/entities/especialidad.entity';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { EstadoModule } from 'src/estados/estado.module';

@Module({
  imports: [TypeOrmModule.forFeature([Docente, Especialidad]),
UsuariosModule,EstadoModule],
  controllers: [DocentesController],
  providers: [DocentesService],
  exports: [DocentesService],
})
export class DocentesModule {}
