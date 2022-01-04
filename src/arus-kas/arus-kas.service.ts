import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateArusKaDto } from './dto/create-arus-ka.dto';
import { UpdateArusKaDto } from './dto/update-arus-ka.dto';
import * as fs from 'fs';

@Injectable()
export class ArusKasService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: { data: Prisma.Arus_kasCreateInput },
    file: Express.Multer.File,
  ) {
    let req: any = data.data;
    req = JSON.parse(req);
    const fileName = file.path.split('\\');
    const path = `/upload/${fileName[fileName.length - 1]}`;
    req.file_bukti = path;

    const kas = this.prisma.arus_kas.create({
      data: req,
    });
    return kas;
  }

  async findAll() {
    const kas = await this.prisma.arus_kas.findMany({
      orderBy: {
        id: 'asc',
      },
    });

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
      '\\public' +
      oldData.file_bukti.replace(/\//g, '\\');

    if (file) {
      const fileName = file.path.split('\\');
      const path = `/upload/${fileName[fileName.length - 1]}`;
      req.file_bukti = path;

      fs.unlinkSync(directoryPath);
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
      '\\public' +
      kas.file_bukti.replace(/\//g, '\\');

    fs.unlinkSync(directoryPath);

    return kas;
  }
}
