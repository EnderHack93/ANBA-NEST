import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SecurityService } from './security.service';
import { SecurityController } from './security.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Security } from './entities/security.entity';
import { LoggingMiddleware } from './middlewares/security_logs.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Security]),
  ],
  controllers: [SecurityController],
  providers: [SecurityService],
  exports: [SecurityModule]

})
export class SecurityModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(LoggingMiddleware)
    .forRoutes('*');
  }
}
