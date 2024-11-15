import { Module } from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';
import { AsistenciaController } from './asistencia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asistencia } from './entities/asistencia.entity';
import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';
import { Clase } from 'src/clases/entities/clase.entity';
import { InscritosModule } from 'src/inscritos/inscritos.module';

@Module({
  imports: [TypeOrmModule.forFeature([Asistencia,Estudiante,Clase]),InscritosModule],
  controllers: [AsistenciaController],
  providers: [AsistenciaService],
})
export class AsistenciaModule {}
