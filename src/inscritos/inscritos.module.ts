import { Module } from '@nestjs/common';
import { InscritosService } from './inscritos.service';
import { InscritosController } from './inscritos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inscrito } from './entities/inscrito.entity';
import { Clase } from 'src/clases/entities/clase.entity';
import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inscrito,Clase,Estudiante])],
  controllers: [InscritosController],
  providers: [InscritosService],
})
export class InscritosModule {}
