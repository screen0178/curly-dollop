import { Module } from '@nestjs/common';
import { ArusKasService } from './arus-kas.service';
import { ArusKasController } from './arus-kas.controller';
import { PrismaService } from 'src/prisma.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
      limits: { fileSize: 25 * 1024 * 1024 },
    }),
  ],
  controllers: [ArusKasController],
  providers: [ArusKasService, PrismaService],
})
export class ArusKasModule {}

// storage: diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './public/upload');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// })
