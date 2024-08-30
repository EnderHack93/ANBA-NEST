import { Module } from '@nestjs/common';
import { DocentesService } from './docentes.service';
import { DocentesController } from './docentes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Docente } from './entities/docente.entity';
import { Especialidad } from 'src/especialidades/entities/especialidad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Docente,Especialidad])],
  controllers: [DocentesController],
  providers: [DocentesService],
})
export class DocentesModule {}
