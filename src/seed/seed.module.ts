import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SeedService } from "./seed.service";
import { Especialidad } from "src/especialidades/entities/especialidad.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Especialidad])],
  providers: [SeedService],
})

export class SeedModule {}