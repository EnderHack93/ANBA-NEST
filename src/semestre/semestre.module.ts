import { Module } from '@nestjs/common';
import { SemestreService } from './semestre.service';
import { SemestreController } from './semestre.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Semestre } from './entities/semestre.entity';
import { EstadoModule } from 'src/estados/estado.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Semestre
    ]),EstadoModule
  ],
  controllers: [SemestreController],
  providers: [SemestreService],
  exports: [SemestreService],
})
export class SemestreModule {}
