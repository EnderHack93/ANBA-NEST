import { Module } from '@nestjs/common';
import { EvaluacionesService } from './evaluaciones.service';
import { EvaluacionesController } from './evaluaciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evaluacion } from './entities/evaluacion.entity';
import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';
import { EstudiantesModule } from 'src/estudiantes/estudiantes.module';
import { ClasesModule } from 'src/clases/clases.module';
import { InscritosModule } from 'src/inscritos/inscritos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Evaluacion,Estudiante]),
    EstudiantesModule,
    ClasesModule,
    InscritosModule
  ],
  controllers: [EvaluacionesController],
  providers: [EvaluacionesService],
})
export class EvaluacionesModule {}
