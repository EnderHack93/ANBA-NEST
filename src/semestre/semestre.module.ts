import { Module } from '@nestjs/common';
import { SemestreService } from './semestre.service';
import { SemestreController } from './semestre.controller';

@Module({
  controllers: [SemestreController],
  providers: [SemestreService],
  exports: [SemestreService],
})
export class SemestreModule {}
