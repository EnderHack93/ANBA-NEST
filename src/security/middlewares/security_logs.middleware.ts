import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request,Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Security } from '../entities/security.entity';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Security)
    private readonly logRepository: Repository<Security>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Obtener IP y usuario de la solicitud
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    //const userId = req.user?.id; // Suponiendo que tengas autenticación y el usuario esté en `req.user`

    // Escuchar la respuesta para capturar la acción completada
    res.on('finish', async () => {
      const action = this.getAction(req.method);
      const table = this.getTableFromUrl(req.originalUrl);

      // Crear registro de log en la base de datos
      const log = this.logRepository.create({
        user_id: "2",
        ipAddress: ip as string,
        action: action,
        tableName: table,
        details: {
          method: req.method,
          path: req.originalUrl,
          body: req.body,
          query: req.query,
        },
      });

      await this.logRepository.save(log);
    });

    next();
  }

  private getAction(method: string): string {
    switch (method) {
      case 'POST':
        return 'CREATE';
      case 'GET':
        return 'READ';
      case 'PUT':
      case 'PATCH':
        return 'UPDATE';
      case 'DELETE':
        return 'DELETE';
      default:
        return 'UNKNOWN';
    }
  }

  private getTableFromUrl(url: string): string {
    // Asumimos que el nombre de la tabla está en el URL, por ejemplo, `/api/users` para tabla `users`
    const segments = url.split('/');
    return segments.length > 1 ? segments[segments.length - 1] : 'unknown';
  }
}
