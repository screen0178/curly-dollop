import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateArusKaDto } from './dto/create-arus-ka.dto';
import { UpdateArusKaDto } from './dto/update-arus-ka.dto';
import * as fs from 'fs';
import sharp from 'sharp';

@Injectable()
export class ArusKasService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: { data: Prisma.Arus_kasCreateInput },
    file: Express.Multer.File,
  ) {
    let req: any = data.data;
    req = JSON.parse(req);
    req.file_bukti = '-';
    if (file) {
      const { buffer, originalname } = file;
      const filename = `${Date.now()}-${originalname}`;
      const ref = `./public/upload/${filename}`;
      await sharp(buffer)
        .resize({ width: 4000, height: 3000, fit: 'fill' })
        .withMetadata()
        .toFile(ref);
      req.file_bukti = filename;
    }
    req.nominal = parseInt(req.nominal);

    const kas = this.prisma.arus_kas.create({
      data: req,
    });
    return kas;
  }

  async findAll(query: { userId: string; companyId: string }) {
    let config;

    if (!query.companyId && query.userId) {
      config = {
        orderBy: {
          id: 'asc',
        },
        where: { userId: parseInt(query.userId) },
      };
      console.log('b');
    } else if (!query.userId && query.companyId) {
      console.log('a');
      config = {
        orderBy: {
          id: 'asc',
        },
        where: { companyId: parseInt(query.companyId) },
      };
    } else if (query.userId && query.companyId) {
      config = {
        orderBy: {
          id: 'asc',
        },
        where: {
          userId: parseInt(query.userId),
          companyId: parseInt(query.companyId),
        },
      };
      console.log('d');
    } else {
      config = {
        orderBy: {
          id: 'asc',
        },
      };
      console.log('c');
    }

    const kas = await this.prisma.arus_kas.findMany(config);

    return kas;
  }

  async findOne(where: Prisma.Arus_kasWhereUniqueInput) {
    const kas = this.prisma.arus_kas.findUnique({
      where,
      include: {
        username: {
          select: {
            id: true,
            username: true,
          },
        },
        company: true,
      },
    });

    return kas;
  }

  async update(
    where: Prisma.Arus_kasWhereUniqueInput,
    data: { data: Prisma.Arus_kasUpdateInput },
    file: Express.Multer.File,
  ) {
    let req: any = data.data || {};
    if (typeof req === 'string') {
      req = JSON.parse(req);
    }

    let oldData = await this.prisma.arus_kas.findUnique({
      where,
    });

    let directoryPath: any = __dirname;
    directoryPath =
      directoryPath.split('\\').slice(0, -2).join('\\') +
      '\\public\\' +
      oldData.file_bukti;

    if (file) {
      const { buffer, originalname } = file;
      const filename = `${Date.now()}-${originalname}`;
      const ref = `./public/upload/${filename}`;
      await sharp(buffer)
        .resize({ width: 4000, height: 3000, fit: 'fill' })
        .withMetadata()
        .toFile(ref);
      req.file_bukti = filename;

      if (oldData.file_bukti !== '-') fs.unlinkSync(directoryPath);
    }

    const kas = await this.prisma.arus_kas.update({
      where,
      data: req,
    });

    return kas;
  }

  async remove(where: Prisma.Arus_kasWhereUniqueInput) {
    const kas = await this.prisma.arus_kas.delete({
      where,
    });

    let directoryPath: any = __dirname;

    directoryPath =
      directoryPath.split('\\').slice(0, -2).join('\\') +
      '\\public\\upload\\' +
      kas.file_bukti;

    if (kas.file_bukti !== '-') fs.unlinkSync(directoryPath);

    return kas;
  }
}
