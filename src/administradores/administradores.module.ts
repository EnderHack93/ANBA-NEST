import { forwardRef, Module } from '@nestjs/common';
import { AdministradoresService } from './administradores.service';
import { AdministradoresController } from './administradores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Administrador } from './entities/administrador.entity';
import { EstadoModule } from 'src/estados/estado.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Administrador]),
    EstadoModule,
    forwardRef(() => UsuariosModule),
  ],
  controllers: [AdministradoresController],
  providers: [AdministradoresService],
  exports: [AdministradoresService],
})
export class AdministradoresModule {}
