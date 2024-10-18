import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Estado } from 'src/estados/entites/estado.entity';
import { EstadoModule } from 'src/estados/estado.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuario,Estado
    ]),EstadoModule
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService]
})
export class UsuariosModule {}
