import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';

const { PORT: port, JWT_TOKEN: jwt } = process.env;

global.__basedir = __dirname;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(port);

  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);
}
bootstrap();
