import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { SeedModule } from "./seed/seed.module";
import { SeedService } from "./seed/seed.service";



async function bootstrap(){

  const app = await NestFactory.create<NestFastifyApplication>(
    SeedModule,
    new FastifyAdapter(),
  );
  const seedService = app.get(SeedService);
  await seedService.seed();
  await app.close()
}

bootstrap().catch(err =>{
  console.log("Error al poblar la base de datos",err);
})